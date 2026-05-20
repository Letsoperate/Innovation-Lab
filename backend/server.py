from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

from models import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    CommentCreate, CommentResponse,
    CategoryResponse, TrackResponse, AudienceResponse,
    SponsorResponse, BlogPostResponse, FAQResponse,
    StatsResponse, HallOfFameItem,
)
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_current_user_optional,
)
from seed import seed_database

import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'vibepush_sa')]

app = FastAPI(title="VibePush SA API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def gen_id():
    return str(uuid.uuid4())


# ──────────────────────────────────────────────
# AUTH ROUTES
# ──────────────────────────────────────────────

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(400, "Email already registered")
    user_id = gen_id()
    now = datetime.utcnow()
    user_doc = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "institution": data.institution or "",
        "created_at": now,
    }
    await db.users.insert_one(user_doc)
    token = create_access_token({"sub": user_id, "email": data.email, "name": data.name})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user_id, name=data.name, email=data.email, institution=data.institution or "", created_at=now)
    )


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user["name"]})
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"], name=user["name"], email=user["email"],
            institution=user.get("institution", ""), created_at=user["created_at"]
        )
    )


@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["sub"]})
    if not user:
        raise HTTPException(404, "User not found")
    return UserResponse(
        id=user["id"], name=user["name"], email=user["email"],
        institution=user.get("institution", ""), created_at=user["created_at"]
    )


# ──────────────────────────────────────────────
# PROJECTS ROUTES
# ──────────────────────────────────────────────

def project_to_response(p: dict) -> dict:
    return {
        "id": p.get("id", ""),
        "name": p.get("name", ""),
        "tagline": p.get("tagline", ""),
        "description": p.get("description", ""),
        "demo_url": p.get("demo_url", ""),
        "repo_url": p.get("repo_url", ""),
        "video_url": p.get("video_url", ""),
        "category": p.get("category", ""),
        "track": p.get("track", ""),
        "institution": p.get("institution", ""),
        "team_name": p.get("team_name", ""),
        "team_size": p.get("team_size", 1),
        "tech_stack": p.get("tech_stack", ""),
        "logo_color": p.get("logo_color", "#009639"),
        "logo_initial": p.get("logo_initial", ""),
        "categories": p.get("categories", []),
        "upvotes": p.get("upvotes", 0),
        "views": p.get("views", 0),
        "comments_count": p.get("comments_count", 0),
        "rating": p.get("rating", 0.0),
        "vibe_push_score": p.get("vibe_push_score", 0),
        "is_trending": p.get("is_trending", False),
        "has_video": p.get("has_video", False),
        "rank": p.get("rank", 0),
        "rank_label": p.get("rank_label", ""),
        "user_id": p.get("user_id", ""),
        "user_name": p.get("user_name", ""),
        "created_at": p.get("created_at", datetime.utcnow()),
        "updated_at": p.get("updated_at", datetime.utcnow()),
    }


def compute_rank_labels(projects: list, period_label: str) -> list:
    """Assign rank labels to top projects."""
    for i, p in enumerate(projects):
        if i == 0:
            p["rank"] = 1
            p["rank_label"] = f"#1 of the {period_label}"
        elif i == 1:
            p["rank"] = 2
            p["rank_label"] = f"#2 of the {period_label}"
        elif i == 2:
            p["rank"] = 3
            p["rank_label"] = f"#3 of the {period_label}"
        else:
            p["rank"] = i + 1
            p["rank_label"] = ""
    return projects


@api_router.get("/projects")
async def list_projects(
    tab: str = Query("top", regex="^(top|live|recent|updated)$"),
    period: Optional[str] = Query(None),
    category: Optional[str] = None,
    track: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
):
    now = datetime.utcnow()
    query = {}

    # Category/track filters
    if category:
        query["category"] = category
    if track:
        query["track"] = track
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"tagline": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    # Time period filter
    if period:
        if period == "today":
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            query["created_at"] = {"$gte": start}
        elif period == "yesterday":
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            yesterday_start = today_start - timedelta(days=1)
            query["created_at"] = {"$gte": yesterday_start, "$lt": today_start}
        elif period == "week":
            start = now - timedelta(days=7)
            query["created_at"] = {"$gte": start}
        elif period == "month":
            start = now - timedelta(days=30)
            query["created_at"] = {"$gte": start}

    # Sorting
    if tab == "top":
        sort_field = [("vibe_push_score", -1), ("upvotes", -1)]
    elif tab == "live":
        # Today's launches only
        if "created_at" not in query:
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            query["created_at"] = {"$gte": start}
        sort_field = [("created_at", -1)]
    elif tab == "recent":
        sort_field = [("created_at", -1)]
    elif tab == "updated":
        sort_field = [("updated_at", -1)]
    else:
        sort_field = [("vibe_push_score", -1)]

    skip = (page - 1) * limit
    cursor = db.projects.find(query).sort(sort_field).skip(skip).limit(limit)
    projects = await cursor.to_list(limit)

    # Increment views
    project_ids = [p["id"] for p in projects]
    if project_ids:
        await db.projects.update_many({"id": {"$in": project_ids}}, {"$inc": {"views": 1}})

    results = [project_to_response(p) for p in projects]
    return {"projects": results, "total": await db.projects.count_documents(query)}


@api_router.get("/projects/grouped")
async def get_grouped_projects():
    """Get projects grouped by time period for the homepage Top tab."""
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday_start = today_start - timedelta(days=1)
    week_start = now - timedelta(days=7)
    month_start = now - timedelta(days=30)

    sort = [("vibe_push_score", -1), ("upvotes", -1)]

    today = await db.projects.find({"created_at": {"$gte": today_start}}).sort(sort).limit(4).to_list(4)
    yesterday = await db.projects.find({"created_at": {"$gte": yesterday_start, "$lt": today_start}}).sort(sort).limit(4).to_list(4)
    week = await db.projects.find({"created_at": {"$gte": week_start}}).sort(sort).limit(2).to_list(2)
    month = await db.projects.find({"created_at": {"$gte": month_start}}).sort(sort).limit(2).to_list(2)

    today = compute_rank_labels([project_to_response(p) for p in today], "Day")
    yesterday = compute_rank_labels([project_to_response(p) for p in yesterday], "Day")
    week = compute_rank_labels([project_to_response(p) for p in week], "Week")
    month = compute_rank_labels([project_to_response(p) for p in month], "Month")

    return {
        "today": today,
        "yesterday": yesterday,
        "week": week,
        "month": month,
    }


@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(404, "Project not found")
    await db.projects.update_one({"id": project_id}, {"$inc": {"views": 1}})
    return project_to_response(project)


@api_router.post("/projects", response_model=ProjectResponse)
async def create_project(data: ProjectCreate, current_user=Depends(get_current_user)):
    now = datetime.utcnow()
    logo_initial = data.logo_initial or data.name[:2].upper()

    # Build categories list from category field
    cat_names = []
    if data.category:
        cat_doc = await db.categories.find_one({"slug": data.category})
        if cat_doc:
            cat_names.append(cat_doc["name"])

    project_doc = {
        "id": gen_id(),
        "name": data.name,
        "tagline": data.tagline,
        "description": data.description,
        "demo_url": data.demo_url,
        "repo_url": data.repo_url,
        "video_url": data.video_url,
        "category": data.category,
        "track": data.track,
        "institution": data.institution,
        "team_name": data.team_name,
        "team_size": data.team_size,
        "tech_stack": data.tech_stack,
        "logo_color": data.logo_color,
        "logo_initial": logo_initial,
        "categories": cat_names,
        "upvotes": 0,
        "views": 0,
        "comments_count": 0,
        "rating": 0.0,
        "vibe_push_score": 0,
        "is_trending": True,
        "has_video": bool(data.video_url),
        "rank": 0,
        "rank_label": "",
        "user_id": current_user["sub"],
        "user_name": current_user["name"],
        "created_at": now,
        "updated_at": now,
    }
    await db.projects.insert_one(project_doc)

    # Update category count
    if data.category:
        await db.categories.update_one({"slug": data.category}, {"$inc": {"count": 1}})

    return ProjectResponse(**project_to_response(project_doc))


@api_router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, data: ProjectUpdate, current_user=Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(404, "Project not found")
    if project["user_id"] != current_user["sub"]:
        raise HTTPException(403, "Not authorized to edit this project")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    if "video_url" in update_data:
        update_data["has_video"] = bool(update_data["video_url"])

    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    updated = await db.projects.find_one({"id": project_id})
    return ProjectResponse(**project_to_response(updated))


# ──────────────────────────────────────────────
# VOTING
# ──────────────────────────────────────────────

@api_router.post("/projects/{project_id}/vote")
async def toggle_vote(project_id: str, current_user=Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(404, "Project not found")

    user_id = current_user["sub"]
    existing = await db.votes.find_one({"project_id": project_id, "user_id": user_id})

    if existing:
        await db.votes.delete_one({"_id": existing["_id"]})
        await db.projects.update_one({"id": project_id}, {"$inc": {"upvotes": -1, "vibe_push_score": -1}})
        return {"voted": False, "upvotes": project["upvotes"] - 1}
    else:
        await db.votes.insert_one({
            "id": gen_id(), "project_id": project_id, "user_id": user_id,
            "created_at": datetime.utcnow()
        })
        await db.projects.update_one({"id": project_id}, {"$inc": {"upvotes": 1, "vibe_push_score": 1}})
        return {"voted": True, "upvotes": project["upvotes"] + 1}


@api_router.get("/projects/{project_id}/vote-status")
async def vote_status(project_id: str, current_user=Depends(get_current_user_optional)):
    if not current_user:
        return {"voted": False}
    existing = await db.votes.find_one({"project_id": project_id, "user_id": current_user["sub"]})
    return {"voted": bool(existing)}


# ──────────────────────────────────────────────
# COMMENTS
# ──────────────────────────────────────────────

@api_router.get("/projects/{project_id}/comments", response_model=List[CommentResponse])
async def get_comments(project_id: str):
    comments = await db.comments.find({"project_id": project_id}).sort("created_at", -1).to_list(100)
    return [CommentResponse(**{
        "id": c["id"], "project_id": c["project_id"],
        "user_id": c["user_id"], "user_name": c["user_name"],
        "text": c["text"], "created_at": c["created_at"]
    }) for c in comments]


@api_router.post("/projects/{project_id}/comments", response_model=CommentResponse)
async def add_comment(project_id: str, data: CommentCreate, current_user=Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(404, "Project not found")

    now = datetime.utcnow()
    comment_doc = {
        "id": gen_id(),
        "project_id": project_id,
        "user_id": current_user["sub"],
        "user_name": current_user["name"],
        "text": data.text,
        "created_at": now,
    }
    await db.comments.insert_one(comment_doc)
    await db.projects.update_one({"id": project_id}, {"$inc": {"comments_count": 1, "vibe_push_score": 1}})

    return CommentResponse(**comment_doc)


# ──────────────────────────────────────────────
# BOOKMARKS
# ──────────────────────────────────────────────

@api_router.post("/projects/{project_id}/bookmark")
async def toggle_bookmark(project_id: str, current_user=Depends(get_current_user)):
    user_id = current_user["sub"]
    existing = await db.bookmarks.find_one({"project_id": project_id, "user_id": user_id})

    if existing:
        await db.bookmarks.delete_one({"_id": existing["_id"]})
        return {"bookmarked": False}
    else:
        await db.bookmarks.insert_one({
            "id": gen_id(), "project_id": project_id, "user_id": user_id,
            "created_at": datetime.utcnow()
        })
        return {"bookmarked": True}


@api_router.get("/bookmarks")
async def get_bookmarks(current_user=Depends(get_current_user)):
    bookmarks = await db.bookmarks.find({"user_id": current_user["sub"]}).to_list(100)
    project_ids = [b["project_id"] for b in bookmarks]
    if not project_ids:
        return {"projects": []}
    projects = await db.projects.find({"id": {"$in": project_ids}}).to_list(100)
    return {"projects": [project_to_response(p) for p in projects]}


@api_router.get("/bookmarks/ids")
async def get_bookmark_ids(current_user=Depends(get_current_user_optional)):
    if not current_user:
        return {"ids": []}
    bookmarks = await db.bookmarks.find({"user_id": current_user["sub"]}).to_list(500)
    return {"ids": [b["project_id"] for b in bookmarks]}


@api_router.get("/votes/ids")
async def get_vote_ids(current_user=Depends(get_current_user_optional)):
    if not current_user:
        return {"ids": []}
    votes = await db.votes.find({"user_id": current_user["sub"]}).to_list(500)
    return {"ids": [v["project_id"] for v in votes]}


# ──────────────────────────────────────────────
# REFERENCE DATA
# ──────────────────────────────────────────────

@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    cats = await db.categories.find().to_list(50)
    return [CategoryResponse(**c) for c in cats]


@api_router.get("/tracks", response_model=List[TrackResponse])
async def get_tracks():
    tracks = await db.tracks.find().to_list(50)
    return [TrackResponse(**t) for t in tracks]


@api_router.get("/audiences", response_model=List[AudienceResponse])
async def get_audiences():
    auds = await db.audiences.find().to_list(50)
    return [AudienceResponse(**a) for a in auds]


@api_router.get("/sponsors", response_model=List[SponsorResponse])
async def get_sponsors():
    sponsors = await db.sponsors.find().to_list(50)
    return [SponsorResponse(**s) for s in sponsors]


@api_router.get("/faq", response_model=List[FAQResponse])
async def get_faq():
    faqs = await db.faq.find().to_list(50)
    return [FAQResponse(**f) for f in faqs]


@api_router.get("/blog", response_model=List[BlogPostResponse])
async def get_blog():
    posts = await db.blog_posts.find().sort("date", -1).to_list(50)
    return [BlogPostResponse(**p) for p in posts]


@api_router.get("/blog/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(404, "Blog post not found")
    return BlogPostResponse(**post)


# ──────────────────────────────────────────────
# STATS & LEADERBOARD
# ──────────────────────────────────────────────

@api_router.get("/stats", response_model=StatsResponse)
async def get_stats():
    total_projects = await db.projects.count_documents({})
    total_votes = 0
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$upvotes"}}}]
    result = await db.projects.aggregate(pipeline).to_list(1)
    if result:
        total_votes = result[0]["total"]
    total_participants = await db.users.count_documents({})
    institutions = await db.projects.distinct("institution")
    return StatsResponse(
        total_projects=total_projects,
        total_votes=total_votes,
        total_participants=max(total_participants, total_projects),
        total_institutions=max(len(institutions), 12),
        current_round="Finals",
        days_remaining=14,
    )


@api_router.get("/leaderboard")
async def get_leaderboard(period: str = Query("all", regex="^(all|month|week|today)$")):
    now = datetime.utcnow()
    query = {}
    if period == "today":
        query["created_at"] = {"$gte": now.replace(hour=0, minute=0, second=0, microsecond=0)}
    elif period == "week":
        query["created_at"] = {"$gte": now - timedelta(days=7)}
    elif period == "month":
        query["created_at"] = {"$gte": now - timedelta(days=30)}

    projects = await db.projects.find(query).sort([("vibe_push_score", -1), ("upvotes", -1)]).limit(20).to_list(20)
    return {"projects": [project_to_response(p) for p in projects]}


@api_router.get("/hall-of-fame")
async def get_hall_of_fame():
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    month_start = now - timedelta(days=30)

    day_best = await db.projects.find({"created_at": {"$gte": today_start}}).sort([("vibe_push_score", -1)]).limit(1).to_list(1)
    week_best = await db.projects.find({"created_at": {"$gte": week_start}}).sort([("vibe_push_score", -1)]).limit(1).to_list(1)
    month_best = await db.projects.find({"created_at": {"$gte": month_start}}).sort([("vibe_push_score", -1)]).limit(1).to_list(1)

    items = []
    if day_best:
        items.append({"name": day_best[0]["name"], "award": "Project of the Day",
                       "logo_color": day_best[0].get("logo_color", "#009639"), "logo_initial": day_best[0].get("logo_initial", "")})
    if week_best:
        items.append({"name": week_best[0]["name"], "award": "Project of the Week",
                       "logo_color": week_best[0].get("logo_color", "#009639"), "logo_initial": week_best[0].get("logo_initial", "")})
    if month_best:
        items.append({"name": month_best[0]["name"], "award": "Project of the Month",
                       "logo_color": month_best[0].get("logo_color", "#009639"), "logo_initial": month_best[0].get("logo_initial", "")})

    return {"items": items}


# ──────────────────────────────────────────────
# SEARCH
# ──────────────────────────────────────────────

@api_router.get("/search")
async def search_projects(q: str = Query(..., min_length=1)):
    query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"tagline": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tech_stack": {"$regex": q, "$options": "i"}},
            {"institution": {"$regex": q, "$options": "i"}},
        ]
    }
    projects = await db.projects.find(query).sort([("vibe_push_score", -1)]).limit(20).to_list(20)
    return {"projects": [project_to_response(p) for p in projects]}


# ──────────────────────────────────────────────
# SEED
# ──────────────────────────────────────────────

@api_router.post("/seed")
async def seed_db():
    result = await seed_database(db)
    return {"message": "Database seeded successfully", "counts": result}


@api_router.get("/")
async def root():
    return {"message": "VibePush SA API", "status": "running"}


# Include router and configure CORS
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.projects.create_index("id", unique=True)
    await db.projects.create_index("user_id")
    await db.projects.create_index("category")
    await db.projects.create_index("track")
    await db.projects.create_index("created_at")
    await db.projects.create_index([("vibe_push_score", -1), ("upvotes", -1)])
    await db.projects.create_index([("name", "text"), ("tagline", "text"), ("description", "text")])
    await db.votes.create_index([("project_id", 1), ("user_id", 1)], unique=True)
    await db.bookmarks.create_index([("project_id", 1), ("user_id", 1)], unique=True)
    await db.comments.create_index("project_id")
    logger.info("Database indexes created")

    # Auto-seed if projects collection is empty
    count = await db.projects.count_documents({})
    if count == 0:
        logger.info("No projects found, auto-seeding database...")
        result = await seed_database(db)
        logger.info(f"Database seeded: {result}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
