from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid


def generate_id():
    return str(uuid.uuid4())


# Auth Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    institution: Optional[str] = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    institution: str = ""
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Project Models
class ProjectCreate(BaseModel):
    name: str
    tagline: str
    description: str = ""
    demo_url: str = ""
    repo_url: str = ""
    video_url: str = ""
    category: str = ""
    track: str = ""
    institution: str = ""
    team_name: str = ""
    team_size: int = 1
    tech_stack: str = ""
    logo_color: str = "#009639"
    logo_initial: str = ""


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    video_url: Optional[str] = None
    category: Optional[str] = None
    track: Optional[str] = None
    tech_stack: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    tagline: str
    description: str = ""
    demo_url: str = ""
    repo_url: str = ""
    video_url: str = ""
    category: str = ""
    track: str = ""
    institution: str = ""
    team_name: str = ""
    team_size: int = 1
    tech_stack: str = ""
    logo_color: str = "#009639"
    logo_initial: str = ""
    categories: List[str] = []
    upvotes: int = 0
    views: int = 0
    comments_count: int = 0
    rating: float = 0.0
    vibe_push_score: int = 0
    is_trending: bool = False
    has_video: bool = False
    rank: int = 0
    rank_label: str = ""
    user_id: str = ""
    user_name: str = ""
    created_at: datetime = None
    updated_at: datetime = None


# Comment Models
class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    user_name: str
    text: str
    created_at: datetime


# Reference Data Models
class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    count: int = 0


class TrackResponse(BaseModel):
    id: str
    name: str
    slug: str


class AudienceResponse(BaseModel):
    id: str
    name: str
    slug: str


class SponsorResponse(BaseModel):
    id: str
    name: str
    description: str = ""
    logo: str = ""
    color: str = ""
    text_color: str = "#fff"


class BlogPostResponse(BaseModel):
    id: str
    title: str
    excerpt: str = ""
    content: str = ""
    date: str = ""
    category: str = ""
    read_time: str = ""


class FAQResponse(BaseModel):
    id: str
    question: str
    answer: str


class StatsResponse(BaseModel):
    total_projects: int = 0
    total_votes: int = 0
    total_participants: int = 0
    total_institutions: int = 0
    current_round: str = "Finals"
    days_remaining: int = 14


class HallOfFameItem(BaseModel):
    name: str
    award: str
    logo_color: str = "#009639"
    logo_initial: str = ""
