import uuid
from datetime import datetime, timedelta
import random


def gen_id():
    return str(uuid.uuid4())


NOW = datetime.utcnow()


def get_seed_categories():
    cats = [
        ("AI & Machine Learning", "ai-ml"),
        ("Web Applications", "web-apps"),
        ("Mobile Apps", "mobile-apps"),
        ("FinTech", "fintech"),
        ("HealthTech", "healthtech"),
        ("AgriTech", "agritech"),
        ("EdTech", "edtech"),
        ("Game Development", "game-dev"),
        ("IoT & Hardware", "iot"),
        ("Social Impact", "social-impact"),
    ]
    return [{"id": gen_id(), "name": n, "slug": s, "count": 0} for n, s in cats]


def get_seed_tracks():
    tracks = [
        ("Best Innovation", "innovation"),
        ("Best UI/UX", "ui-ux"),
        ("Most Scalable", "scalable"),
        ("Community Impact", "community"),
        ("Best Use of AI", "best-ai"),
        ("Open Source Hero", "open-source"),
    ]
    return [{"id": gen_id(), "name": n, "slug": s} for n, s in tracks]


def get_seed_audiences():
    auds = [
        ("University Students", "university"),
        ("TVET College Students", "tvet"),
        ("Bootcamp Graduates", "bootcamp"),
        ("Professional Developers", "professionals"),
        ("High School Learners", "highschool"),
        ("Startup Founders", "founders"),
    ]
    return [{"id": gen_id(), "name": n, "slug": s} for n, s in auds]


def get_seed_sponsors():
    sponsors = [
        ("MTN SA", "Powering digital innovation across Africa", "MTN", "#FFCB05", "#000"),
        ("FNB", "How can we help you?", "FNB", "#009A44", "#fff"),
        ("Naspers", "Investing in SA tech talent", "NP", "#1A1A2E", "#fff"),
        ("Vodacom", "Future-ready with Vodacom", "VC", "#E60000", "#fff"),
        ("Standard Bank", "It can be. With Standard Bank", "SB", "#003DA5", "#fff"),
        ("Discovery", "Shared value in tech", "DI", "#00A1E0", "#fff"),
    ]
    return [
        {"id": gen_id(), "name": n, "description": d, "logo": l, "color": c, "text_color": tc}
        for n, d, l, c, tc in sponsors
    ]


def get_seed_faq():
    items = [
        (
            "What is VibePush SA?",
            "VibePush SA is South Africa's premier vibe coding competition platform. It's where developers, students, and tech enthusiasts showcase their vibe-coded projects, get community feedback, and compete for prizes. Projects are ranked by community votes, engagement, and judge evaluations across multiple tracks.",
        ),
        (
            "What is vibe coding?",
            "Vibe coding is a modern approach to software development that emphasizes rapid prototyping, AI-assisted development, and building with creative energy. It's about coding in your flow state, using AI tools to accelerate development, and creating products that resonate with users.",
        ),
        (
            "How does the competition work?",
            "Teams or individuals submit their vibe-coded projects to VibePush SA. Projects go through community voting rounds where anyone can upvote, comment, and rate. Top projects advance through daily, weekly, and monthly rankings. The finals are judged by industry experts from leading SA tech companies.",
        ),
        (
            "Who can participate?",
            "The competition is open to all South African residents including university students, TVET college students, bootcamp graduates, professional developers, and even high school learners. You can participate as an individual or as a team of up to 4 members.",
        ),
        (
            "What is a VibePush score?",
            "The VibePush score is a community engagement metric that reflects how actively a project participates in the ecosystem. It's calculated based on upvotes, comments, shares, and mutual support from other builders.",
        ),
        (
            "What are the prizes?",
            "The total prize pool is R500,000. Grand Prize: R150,000 + 6-month incubation. First Runner-Up: R100,000. Second Runner-Up: R75,000. Track winners receive R25,000 each. Additional prizes include cloud credits, mentorship, and internship opportunities.",
        ),
    ]
    return [{"id": gen_id(), "question": q, "answer": a} for q, a in items]


def get_seed_blog():
    posts = [
        (
            "Finals Round Kicks Off: 28 Teams Compete for R500K in Prizes",
            "The VibePush SA coding competition finals have officially begun with teams from 12 universities showcasing their innovative vibe-coded projects. The community voting phase is in full swing.",
            "The VibePush SA coding competition finals have officially begun with teams from 12 universities showcasing their innovative vibe-coded projects. From AI-powered healthcare solutions to community safety apps, the diversity of entries this year has been remarkable. Judges from MTN, Naspers, and Standard Bank will evaluate the top 28 projects.",
            "2025-07-15",
            "Competition Updates",
            "3 min read",
        ),
        (
            "How MediTrack AI Won Hearts with Vibe Coding",
            "A deep dive into how Team HealthHack used AI-first vibe coding to build a solution for rural clinics that's already being piloted in the Eastern Cape.",
            "Team HealthHack from the University of Cape Town took an unconventional approach to the competition. Instead of planning for weeks, they dove straight into building with AI assistance. Using Claude and GPT to rapidly prototype their patient tracking system, they built a working MVP in just 48 hours.",
            "2025-07-12",
            "Project Spotlight",
            "5 min read",
        ),
        (
            "5 Tips to Boost Your VibePush Score Before Finals",
            "Community engagement matters. Here's how to get more votes and improve your project visibility before the finals deadline.",
            "Your VibePush score isn't just about getting upvotes. It's a holistic measure of how you engage with the community. Here are five proven strategies: 1) Give detailed feedback on other projects. 2) Share your building journey on social media. 3) Respond to every comment on your project. 4) Update your project regularly. 5) Attend virtual workshops.",
            "2025-07-10",
            "Tips & Tricks",
            "4 min read",
        ),
        (
            "Meet the Judges: SA's Top Tech Leaders",
            "From Naspers to MTN, meet the industry veterans who will judge the finals and decide who takes home R150K.",
            "This year's judging panel includes some of South Africa's most influential tech leaders. They bring decades of experience in building, scaling, and investing in technology companies across Africa.",
            "2025-07-08",
            "Competition Updates",
            "6 min read",
        ),
    ]
    return [
        {
            "id": gen_id(),
            "title": t,
            "excerpt": e,
            "content": c,
            "date": d,
            "category": cat,
            "read_time": rt,
        }
        for t, e, c, d, cat, rt in posts
    ]


def get_seed_projects():
    projects = [
        {
            "name": "MediTrack AI",
            "tagline": "AI-powered patient tracking for rural clinics",
            "description": "MediTrack AI uses machine learning to help rural clinics in South Africa track patient records, predict disease outbreaks, and optimize resource allocation. Built with React, Python, and TensorFlow.",
            "team_name": "Team HealthHack",
            "institution": "University of Cape Town",
            "category": "ai-ml",
            "track": "best-ai",
            "categories": ["AI & Machine Learning", "HealthTech"],
            "upvotes": 47,
            "views": 89,
            "comments_count": 12,
            "rating": 4.9,
            "vibe_push_score": 28,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#E74C3C",
            "logo_initial": "MT",
            "demo_url": "https://meditrack-ai.example.com",
            "video_url": "https://youtube.com/watch?v=example1",
            "tech_stack": "React, Python, TensorFlow, MongoDB",
            "team_size": 3,
            "created_at": NOW - timedelta(hours=6),
        },
        {
            "name": "FarmLink SA",
            "tagline": "Connecting small-scale farmers to markets via WhatsApp",
            "description": "FarmLink SA bridges the gap between small-scale farmers and urban markets using WhatsApp Business API. Farmers can list produce, negotiate prices, and arrange logistics.",
            "team_name": "AgriCoders",
            "institution": "Stellenbosch University",
            "category": "agritech",
            "track": "community",
            "categories": ["AgriTech", "Mobile Apps"],
            "upvotes": 38,
            "views": 72,
            "comments_count": 8,
            "rating": 4.8,
            "vibe_push_score": 22,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#27AE60",
            "logo_initial": "FL",
            "demo_url": "https://farmlink-sa.example.com",
            "tech_stack": "Node.js, WhatsApp API, PostgreSQL",
            "team_size": 2,
            "created_at": NOW - timedelta(hours=8),
        },
        {
            "name": "LoadShedding Buddy",
            "tagline": "Smart load shedding scheduler with solar optimization",
            "description": "LoadShedding Buddy helps South Africans optimize their energy usage during load shedding by integrating with Eskom's schedule and solar panel systems.",
            "team_name": "PowerUp Dev",
            "institution": "University of Johannesburg",
            "category": "iot",
            "track": "innovation",
            "categories": ["IoT & Hardware", "Web Applications"],
            "upvotes": 31,
            "views": 58,
            "comments_count": 6,
            "rating": 4.7,
            "vibe_push_score": 18,
            "is_trending": True,
            "has_video": False,
            "logo_color": "#F39C12",
            "logo_initial": "LS",
            "demo_url": "https://loadshedding-buddy.example.com",
            "tech_stack": "React, Firebase, IoT sensors",
            "team_size": 4,
            "created_at": NOW - timedelta(hours=10),
        },
        {
            "name": "TaxiTracker",
            "tagline": "Real-time minibus taxi routes and ETA for commuters",
            "description": "TaxiTracker provides real-time tracking of minibus taxis across major routes in South Africa, giving commuters estimated arrival times.",
            "team_name": "CommuteTech",
            "institution": "CPUT",
            "category": "mobile-apps",
            "track": "community",
            "categories": ["Mobile Apps", "Social Impact"],
            "upvotes": 28,
            "views": 45,
            "comments_count": 4,
            "rating": 4.5,
            "vibe_push_score": 15,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#8E44AD",
            "logo_initial": "TT",
            "demo_url": "https://taxitracker.example.com",
            "tech_stack": "React Native, Google Maps API, Node.js",
            "team_size": 3,
            "created_at": NOW - timedelta(hours=12),
        },
        {
            "name": "EduBridge",
            "tagline": "Offline-first learning platform for township schools",
            "description": "EduBridge provides curriculum-aligned learning content that works offline, designed specifically for schools in areas with limited internet connectivity.",
            "team_name": "LearnSA",
            "institution": "Wits University",
            "category": "edtech",
            "track": "community",
            "categories": ["EdTech", "Social Impact"],
            "upvotes": 52,
            "views": 98,
            "comments_count": 15,
            "rating": 5.0,
            "vibe_push_score": 35,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#3498DB",
            "logo_initial": "EB",
            "demo_url": "https://edubridge.example.com",
            "tech_stack": "PWA, IndexedDB, React, Service Workers",
            "team_size": 4,
            "created_at": NOW - timedelta(days=1, hours=4),
        },
        {
            "name": "Stokvel Manager",
            "tagline": "Digital stokvel management with transparent tracking",
            "description": "Stokvel Manager digitizes the traditional South African savings club (stokvel) system, providing transparent tracking of contributions, payouts, and financial records.",
            "team_name": "FinCoders",
            "institution": "University of Pretoria",
            "category": "fintech",
            "track": "innovation",
            "categories": ["FinTech", "Web Applications"],
            "upvotes": 44,
            "views": 81,
            "comments_count": 11,
            "rating": 4.9,
            "vibe_push_score": 30,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#1ABC9C",
            "logo_initial": "SM",
            "demo_url": "https://stokvel-manager.example.com",
            "tech_stack": "Next.js, Stripe, MongoDB",
            "team_size": 2,
            "created_at": NOW - timedelta(days=1, hours=8),
        },
        {
            "name": "SafeWalk SA",
            "tagline": "Community safety app with real-time incident mapping",
            "description": "SafeWalk SA helps communities report and track safety incidents in real-time, creating crowd-sourced safety maps for neighborhoods.",
            "team_name": "SecureTech",
            "institution": "Nelson Mandela University",
            "category": "mobile-apps",
            "track": "community",
            "categories": ["Mobile Apps", "Social Impact"],
            "upvotes": 39,
            "views": 67,
            "comments_count": 9,
            "rating": 4.8,
            "vibe_push_score": 25,
            "is_trending": True,
            "has_video": False,
            "logo_color": "#E67E22",
            "logo_initial": "SW",
            "demo_url": "https://safewalk-sa.example.com",
            "tech_stack": "Flutter, Firebase, Google Maps",
            "team_size": 3,
            "created_at": NOW - timedelta(days=1, hours=12),
        },
        {
            "name": "iSizulu NLP",
            "tagline": "Natural language processing toolkit for isiZulu",
            "description": "iSizulu NLP is an open-source NLP toolkit designed specifically for the isiZulu language, supporting tokenization, sentiment analysis, and translation.",
            "team_name": "LangTech UKZN",
            "institution": "University of KwaZulu-Natal",
            "category": "ai-ml",
            "track": "best-ai",
            "categories": ["AI & Machine Learning"],
            "upvotes": 35,
            "views": 54,
            "comments_count": 7,
            "rating": 4.7,
            "vibe_push_score": 20,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#9B59B6",
            "logo_initial": "iZ",
            "demo_url": "https://isizulu-nlp.example.com",
            "tech_stack": "Python, Hugging Face, FastAPI",
            "team_size": 2,
            "created_at": NOW - timedelta(days=1, hours=16),
        },
        {
            "name": "WaterSense IoT",
            "tagline": "Smart water monitoring for drought-prone communities",
            "description": "WaterSense uses IoT sensors and AI to monitor water levels in tanks, detect leaks, and optimize water usage in drought-prone areas of South Africa.",
            "team_name": "AquaTech",
            "institution": "University of Cape Town",
            "category": "iot",
            "track": "innovation",
            "categories": ["IoT & Hardware", "Social Impact"],
            "upvotes": 89,
            "views": 156,
            "comments_count": 23,
            "rating": 5.0,
            "vibe_push_score": 52,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#2980B9",
            "logo_initial": "WS",
            "demo_url": "https://watersense-iot.example.com",
            "tech_stack": "Arduino, React, MQTT, InfluxDB",
            "team_size": 4,
            "created_at": NOW - timedelta(days=4),
        },
        {
            "name": "Braai Master AR",
            "tagline": "AR-powered braai temperature and timing assistant",
            "description": "Braai Master AR uses augmented reality and thermal sensors to help you cook the perfect braai. Point your phone at the meat to get real-time temperature readings.",
            "team_name": "FireCoders",
            "institution": "Stellenbosch University",
            "category": "game-dev",
            "track": "ui-ux",
            "categories": ["Game Development", "Mobile Apps"],
            "upvotes": 67,
            "views": 134,
            "comments_count": 19,
            "rating": 4.8,
            "vibe_push_score": 45,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#D35400",
            "logo_initial": "BM",
            "demo_url": "https://braai-master.example.com",
            "tech_stack": "Unity, ARKit, Swift",
            "team_size": 2,
            "created_at": NOW - timedelta(days=5),
        },
        {
            "name": "Ubuntu Connect",
            "tagline": "Community networking platform celebrating African Ubuntu philosophy",
            "description": "Ubuntu Connect is a social networking platform built on the African philosophy of Ubuntu - I am because we are. It connects communities for mutual support.",
            "team_name": "UbuntuDev",
            "institution": "Wits University",
            "category": "web-apps",
            "track": "community",
            "categories": ["Web Applications", "Social Impact"],
            "upvotes": 234,
            "views": 456,
            "comments_count": 45,
            "rating": 4.9,
            "vibe_push_score": 120,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#16A085",
            "logo_initial": "UC",
            "demo_url": "https://ubuntu-connect.example.com",
            "tech_stack": "Next.js, Prisma, PostgreSQL, Tailwind",
            "team_size": 4,
            "created_at": NOW - timedelta(days=20),
        },
        {
            "name": "Rand Tracker",
            "tagline": "AI forex predictor for ZAR with economic indicators",
            "description": "Rand Tracker uses machine learning to predict ZAR exchange rate movements by analyzing economic indicators, news sentiment, and historical patterns.",
            "team_name": "FinAI Team",
            "institution": "University of Pretoria",
            "category": "fintech",
            "track": "best-ai",
            "categories": ["FinTech", "AI & Machine Learning"],
            "upvotes": 178,
            "views": 389,
            "comments_count": 32,
            "rating": 4.7,
            "vibe_push_score": 98,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#2C3E50",
            "logo_initial": "RT",
            "demo_url": "https://rand-tracker.example.com",
            "tech_stack": "Python, LSTM, React, Alpha Vantage API",
            "team_size": 3,
            "created_at": NOW - timedelta(days=18),
        },
        {
            "name": "Spaza Shop POS",
            "tagline": "Affordable point-of-sale system for spaza shops",
            "description": "A lightweight POS system designed for informal spaza shops, working on low-end Android devices with offline capability.",
            "team_name": "RetailTech",
            "institution": "Durban University of Technology",
            "category": "fintech",
            "track": "innovation",
            "categories": ["FinTech", "Web Applications"],
            "upvotes": 12,
            "views": 23,
            "comments_count": 3,
            "rating": 4.2,
            "vibe_push_score": 5,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#E74C3C",
            "logo_initial": "SP",
            "demo_url": "https://spaza-pos.example.com",
            "tech_stack": "React, PWA, IndexedDB",
            "team_size": 2,
            "created_at": NOW - timedelta(hours=3),
        },
        {
            "name": "Khaya Finder",
            "tagline": "Affordable housing search for young professionals",
            "description": "Khaya Finder aggregates affordable housing listings across South Africa's major cities.",
            "team_name": "HomeTech SA",
            "institution": "University of Johannesburg",
            "category": "web-apps",
            "track": "ui-ux",
            "categories": ["Web Applications"],
            "upvotes": 9,
            "views": 18,
            "comments_count": 2,
            "rating": 0,
            "vibe_push_score": 3,
            "is_trending": True,
            "has_video": False,
            "logo_color": "#3498DB",
            "logo_initial": "KF",
            "demo_url": "https://khaya-finder.example.com",
            "tech_stack": "Vue.js, Supabase",
            "team_size": 1,
            "created_at": NOW - timedelta(hours=4),
        },
        {
            "name": "Vibe Chess SA",
            "tagline": "AI-powered chess coach with SA tournament integration",
            "description": "An AI chess coach that integrates with South African chess federation tournaments.",
            "team_name": "ChessMates",
            "institution": "Rhodes University",
            "category": "game-dev",
            "track": "best-ai",
            "categories": ["Game Development", "AI & Machine Learning"],
            "upvotes": 7,
            "views": 15,
            "comments_count": 1,
            "rating": 4.5,
            "vibe_push_score": 2,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#8E44AD",
            "logo_initial": "VC",
            "demo_url": "https://vibe-chess.example.com",
            "tech_stack": "Python, Stockfish, React",
            "team_size": 2,
            "created_at": NOW - timedelta(hours=5),
        },
        {
            "name": "Mzansi Weather",
            "tagline": "Hyperlocal weather predictions for South African regions",
            "description": "Hyperlocal weather predictions specifically tuned for South African microclimates.",
            "team_name": "WeatherWise",
            "institution": "University of Cape Town",
            "category": "mobile-apps",
            "track": "scalable",
            "categories": ["Mobile Apps", "AI & Machine Learning"],
            "upvotes": 6,
            "views": 12,
            "comments_count": 1,
            "rating": 0,
            "vibe_push_score": 1,
            "is_trending": False,
            "has_video": False,
            "logo_color": "#1ABC9C",
            "logo_initial": "MW",
            "demo_url": "https://mzansi-weather.example.com",
            "tech_stack": "React Native, OpenWeather API",
            "team_size": 1,
            "created_at": NOW - timedelta(hours=7),
        },
        {
            "name": "Gig Connect SA",
            "tagline": "Freelance marketplace for South African creators",
            "description": "Gig Connect SA is a freelance marketplace designed for the South African market with ZAR payments.",
            "team_name": "GigTech",
            "institution": "WeThinkCode_",
            "category": "web-apps",
            "track": "scalable",
            "categories": ["Web Applications", "FinTech"],
            "upvotes": 5,
            "views": 10,
            "comments_count": 0,
            "rating": 0,
            "vibe_push_score": 1,
            "is_trending": True,
            "has_video": True,
            "logo_color": "#F39C12",
            "logo_initial": "GC",
            "demo_url": "https://gig-connect.example.com",
            "tech_stack": "Next.js, Stripe, MongoDB",
            "team_size": 3,
            "created_at": NOW - timedelta(hours=9),
        },
        {
            "name": "Heritage AR Tour",
            "tagline": "Augmented reality tours of SA historical sites",
            "description": "Heritage AR Tour brings South African historical sites to life through augmented reality experiences.",
            "team_name": "HistoryTech",
            "institution": "Stellenbosch University",
            "category": "mobile-apps",
            "track": "ui-ux",
            "categories": ["Mobile Apps", "EdTech"],
            "upvotes": 4,
            "views": 8,
            "comments_count": 0,
            "rating": 4.0,
            "vibe_push_score": 1,
            "is_trending": False,
            "has_video": True,
            "logo_color": "#E67E22",
            "logo_initial": "HA",
            "demo_url": "https://heritage-ar.example.com",
            "tech_stack": "Unity, ARCore, Firebase",
            "team_size": 2,
            "created_at": NOW - timedelta(hours=11),
        },
    ]

    for p in projects:
        p["id"] = gen_id()
        p["user_id"] = "seed-user"
        p["user_name"] = p["team_name"]
        if "created_at" not in p:
            p["created_at"] = NOW
        p["updated_at"] = p["created_at"]

    return projects


async def seed_database(db):
    """Seed the database with initial data. Clears existing data first."""
    # Clear collections
    for coll in ["categories", "tracks", "audiences", "sponsors", "faq", "blog_posts", "projects", "votes", "comments", "bookmarks"]:
        await db[coll].delete_many({})

    # Seed reference data
    cats = get_seed_categories()
    await db.categories.insert_many(cats)

    tracks = get_seed_tracks()
    await db.tracks.insert_many(tracks)

    auds = get_seed_audiences()
    await db.audiences.insert_many(auds)

    sponsors = get_seed_sponsors()
    await db.sponsors.insert_many(sponsors)

    faq = get_seed_faq()
    await db.faq.insert_many(faq)

    blog = get_seed_blog()
    await db.blog_posts.insert_many(blog)

    projects = get_seed_projects()
    await db.projects.insert_many(projects)

    # Update category counts
    for cat in cats:
        count = await db.projects.count_documents({"category": cat["slug"]})
        await db.categories.update_one({"id": cat["id"]}, {"$set": {"count": count}})

    return {
        "categories": len(cats),
        "tracks": len(tracks),
        "audiences": len(auds),
        "sponsors": len(sponsors),
        "faq": len(faq),
        "blog_posts": len(blog),
        "projects": len(projects),
    }
