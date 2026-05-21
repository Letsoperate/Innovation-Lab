package com.innovationlab.service;

import com.innovationlab.model.entity.*;
import com.innovationlab.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class SeedService {

    private final CategoryRepository categoryRepo;
    private final TrackRepository trackRepo;
    private final AudienceRepository audienceRepo;
    private final SponsorRepository sponsorRepo;
    private final FAQRepository faqRepo;
    private final BlogPostRepository blogPostRepo;
    private final ProjectRepository projectRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepo;

    @org.springframework.beans.factory.annotation.Autowired
    private VoteRepository voteRepo;
    @org.springframework.beans.factory.annotation.Autowired
    private CommentRepository commentRepo;
    @org.springframework.beans.factory.annotation.Autowired
    private BookmarkRepository bookmarkRepo;

    public SeedService(CategoryRepository categoryRepo, TrackRepository trackRepo,
                       AudienceRepository audienceRepo, SponsorRepository sponsorRepo,
                       FAQRepository faqRepo, BlogPostRepository blogPostRepo,
                       ProjectRepository projectRepo, PasswordEncoder passwordEncoder,
                       UserRepository userRepo) {
        this.categoryRepo = categoryRepo;
        this.trackRepo = trackRepo;
        this.audienceRepo = audienceRepo;
        this.sponsorRepo = sponsorRepo;
        this.faqRepo = faqRepo;
        this.blogPostRepo = blogPostRepo;
        this.projectRepo = projectRepo;
        this.passwordEncoder = passwordEncoder;
        this.userRepo = userRepo;
    }

    @Transactional
    public Map<String, Integer> seed() {
        projectRepo.deleteAllInBatch();
        voteRepo.deleteAllInBatch();
        commentRepo.deleteAllInBatch();
        bookmarkRepo.deleteAllInBatch();
        blogPostRepo.deleteAllInBatch();
        sponsorRepo.deleteAllInBatch();
        faqRepo.deleteAllInBatch();
        audienceRepo.deleteAllInBatch();
        trackRepo.deleteAllInBatch();
        categoryRepo.deleteAllInBatch();

        int catCount = seedCategories();
        int trackCount = seedTracks();
        int audienceCount = seedAudiences();
        int sponsorCount = seedSponsors();
        int faqCount = seedFAQ();
        int blogCount = seedBlogPosts();
        int projectCount = seedProjects();
        int commentCount = seedComments();
        int userCount = seedUsers();

        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("categories", catCount);
        counts.put("tracks", trackCount);
        counts.put("audiences", audienceCount);
        counts.put("sponsors", sponsorCount);
        counts.put("faq", faqCount);
        counts.put("blogPosts", blogCount);
        counts.put("projects", projectCount);
        counts.put("comments", commentCount);
        counts.put("users", userCount);
        return counts;
    }

    private int seedCategories() {
        List<Category> categories = List.of(
                new Category("AI", "ai", 0),
                new Category("Automation & Workflow", "automation-workflow", 0),
                new Category("Developer Tools", "developer-tools", 0),
                new Category("Analytics & Monitoring", "analytics-monitoring", 0),
                new Category("Content Creation", "content-creation", 0),
                new Category("Data Analysis", "data-analysis", 0),
                new Category("Marketing & SEO", "marketing-seo", 0),
                new Category("Productivity", "productivity", 0),
                new Category("Finance & Trading", "finance-trading", 0),
                new Category("Gaming", "gaming", 0),
                new Category("Health & Wellness", "health-wellness", 0),
                new Category("Education & Learning", "education-learning", 0)
        );
        categoryRepo.saveAll(categories);
        return categories.size();
    }

    private int seedTracks() {
        List<Track> tracks = List.of(
                new Track("Innovation", "innovation"),
                new Track("Social Impact", "social-impact"),
                new Track("AI/ML", "ai-ml"),
                new Track("FinTech", "fintech"),
                new Track("Gaming", "gaming"),
                new Track("Open", "open")
        );
        trackRepo.saveAll(tracks);
        return tracks.size();
    }

    private int seedAudiences() {
        List<Audience> audiences = List.of(
                new Audience("Non-Technical Users", "non-technical-users"),
                new Audience("Founders & CEOs", "founders-ceos"),
                new Audience("Small Businesses", "small-businesses"),
                new Audience("Freelancers", "freelancers"),
                new Audience("Developers", "developers"),
                new Audience("Designers", "designers"),
                new Audience("Students", "students"),
                new Audience("Job Seekers", "job-seekers")
        );
        audienceRepo.saveAll(audiences);
        return audiences.size();
    }

    private int seedSponsors() {
        List<Sponsor> sponsors = new ArrayList<>();
        
        String sponsorPass = passwordEncoder.encode("sponsor123");

        Sponsor mtn = new Sponsor("MTN Group", "Africa's leading telecommunications company, connecting communities through mobile and digital innovation.",
                "MTN", "#FFC107", "#000000");
        mtn.setEmail("mtn@innovationlab.co.za");
        mtn.setPasswordHash(sponsorPass);
        mtn.setWebsite("https://www.mtn.com");
        sponsors.add(mtn);
        
        Sponsor sb = new Sponsor("Standard Bank", "South Africa's largest bank by assets, driving financial inclusion and economic growth.",
                "SB", "#003A70", "#FFFFFF");
        sb.setEmail("standardbank@innovationlab.co.za");
        sb.setPasswordHash(sponsorPass);
        sb.setWebsite("https://www.standardbank.co.za");
        sponsors.add(sb);
        
        Sponsor tk = new Sponsor("Takealot", "South Africa's largest online retailer, empowering digital commerce across the continent.",
                "TK", "#FF6B00", "#FFFFFF");
        tk.setEmail("takealot@innovationlab.co.za");
        tk.setPasswordHash(sponsorPass);
        tk.setWebsite("https://www.takealot.com");
        sponsors.add(tk);
        
        Sponsor inv = new Sponsor("Investec", "Specialist banking and wealth management group committed to entrepreneurial excellence.",
                "IN", "#1A3A5C", "#FFFFFF");
        inv.setEmail("investec@innovationlab.co.za");
        inv.setPasswordHash(sponsorPass);
        inv.setWebsite("https://www.investec.com");
        sponsors.add(inv);
        
        Sponsor dd = new Sponsor("Dimension Data", "Global technology integrator and managed services provider, headquartered in Johannesburg.",
                "DD", "#0072C6", "#FFFFFF");
        dd.setEmail("dimensiondata@innovationlab.co.za");
        dd.setPasswordHash(sponsorPass);
        dd.setWebsite("https://www.dimensiondata.com");
        sponsors.add(dd);
        
        Sponsor nas = new Sponsor("Naspers", "Global consumer internet group and one of the largest technology investors worldwide.",
                "NP", "#D0021B", "#FFFFFF");
        nas.setEmail("naspers@innovationlab.co.za");
        nas.setPasswordHash(sponsorPass);
        nas.setWebsite("https://www.naspers.com");
        sponsors.add(nas);

        sponsorRepo.saveAll(sponsors);
        return sponsors.size();
    }

    private int seedFAQ() {
        List<FAQ> faqs = List.of(
                new FAQ("What is the Innovation Lab?",
                        "Innovation Lab is the product discovery platform for people and AI. Products are described in a structured, machine-readable way with controlled vocabularies for use cases, audiences, platforms, and pricing — so both humans and AI systems can discover exactly what they need. Innovation Lab also provides an MCP server and public API for AI integration, plus a supportive builder community that helps products gain traction."),
                new FAQ("How does Innovation Lab compare to Product Hunt?",
                        "While Product Hunt focuses on a single launch day, Innovation Lab provides sustained discovery beyond launch day. Innovation Lab features structured product data for AI discoverability, build-in-public features with product updates, transparent revenue tracking, and a community engagement system that rewards mutual support. Products continue gaining visibility long after their initial launch."),
                new FAQ("What is an Innovation Score?",
                        "The Innovation Score is a community engagement metric that reflects how actively a product participates in the ecosystem. It is calculated based on upvotes, comments, shares, and mutual support from other builders. A higher Innovation Score increases visibility in the product directory and improves chances of winning daily, weekly, and monthly product awards."),
                new FAQ("How do I submit my product?",
                        "To submit your product, create a free account and click \"Submit Your Project.\" You can provide a URL and Innovation Lab will auto-fill product details using AI, or fill in the information manually. Products can include use cases, target audiences, pricing, platforms, alternatives, screenshots, and a description."),
                new FAQ("Can AI assistants find products listed on Innovation Lab?",
                        "Yes. Innovation Lab is optimized for AI search engines including ChatGPT, Perplexity, Google AI Overviews, Microsoft Copilot, and Claude. Products are stored with structured data and controlled vocabularies that AI systems can reliably query and recommend. Innovation Lab explicitly allows all major AI crawlers to index the site."),
                new FAQ("How much does it cost to list a product?",
                        "Listing a product on Innovation Lab is free. Free listings join a publishing queue. Paid plans include: Basic (R35) for instant publishing with a high-authority backlink, Boosted (R89) for 7-day promotion with 20,000+ impressions, and Max-Boosted (R189) for 30-day promotion with 100,000+ impressions.")
        );
        faqRepo.saveAll(faqs);
        return faqs.size();
    }

    private int seedBlogPosts() {
        List<BlogPost> posts = List.of(
                new BlogPost("Innovation Lab 2025 Launches with Record Participation",
                        "This year's Innovation Lab competition has attracted over 500 teams from universities and tech hubs across South Africa, marking the highest participation in the event's history.",
                        "<p>Innovation Lab 2025 has officially launched with unprecedented enthusiasm from South Africa's tech community. Over 500 teams have registered, representing more than 40 institutions across all nine provinces.</p><p>This year's competition features six tracks including AI/ML, FinTech, and Social Impact, with a special focus on solutions for African challenges.</p>",
                        "2025-03-15", "Announcements", "3 min read"),
                new BlogPost("Meet the Mentors: Industry Leaders Guiding Innovation Lab Teams",
                        "A stellar lineup of mentors from companies like Standard Bank, MTN, and Takealot will provide guidance and expertise to participating teams throughout the competition.",
                        "<p>Innovation Lab is proud to announce this year's mentor lineup featuring senior engineers, product leaders, and founders from South Africa's top technology companies.</p><p>Mentors will host weekly office hours, provide code reviews, and help teams refine their pitches ahead of the final presentations.</p>",
                        "2025-04-02", "Community", "5 min read"),
                new BlogPost("Top Projects to Watch at Innovation Lab 2025 Midpoint",
                        "With judging just around the corner, we spotlight ten standout projects that are generating buzz among mentors and the community for their innovative approaches.",
                        "<p>At the halfway mark of Innovation Lab 2025, several projects have emerged as early favorites, combining technical excellence with creative problem-solving.</p><p>From AI-powered healthcare diagnostics to blockchain-based land registry systems, this year's projects tackle some of South Africa's most pressing challenges.</p>",
                        "2025-05-10", "Projects", "4 min read"),
                new BlogPost("How Innovation Lab Is Shaping South Africa's Tech Future",
                        "Alumni of the Innovation Lab competition have gone on to raise over R50 million in funding and create hundreds of jobs, demonstrating the program's lasting impact.",
                        "<p>Five years since its inception, the Innovation Lab competition has become a cornerstone of South Africa's tech ecosystem. Alumni companies have collectively raised over R50 million in venture funding and created more than 300 jobs.</p><p>Several winning projects have evolved into successful startups now serving customers across Africa and beyond.</p>",
                        "2025-05-28", "Impact", "6 min read")
        );
        blogPostRepo.saveAll(posts);
        return posts.size();
    }

    private int seedProjects() {
        Random rand = new Random(42);
        List<Project> projects = new ArrayList<>();

        // --- Today Top (from peerpush.net) ---
        projects.add(build("SikkerKey", "Secrets management with secure machine authentication",
                "A comprehensive secrets management platform that provides secure machine-to-machine authentication, API key management, and encrypted credential storage for enterprise teams.",
                "ai", "innovation", "Authentication Compliance", 711, 186, 22, 4.5, true, 0,
                hoursAgo(2)));
        projects.add(build("Neshys PR Platform", "A PR outreach platform made for personal media relationships",
                "Build meaningful media relationships with a PR outreach platform designed for personalized journalist connections, campaign tracking, and measurable PR results.",
                "marketing-seo", "open", "Public Relations Content Promotion", 1219, 245, 4, 5.0, true, 1,
                hoursAgo(3)));
        projects.add(build("Avif2JPG", "Bulk convert AVIF to JPG, PNG, and WebP online privately",
                "Free online tool for bulk converting AVIF images to JPG, PNG, and WebP formats. All processing happens locally in your browser for complete privacy.",
                "developer-tools", "open", "Free File Conversion", 614, 178, 11, 4.3, true, 0,
                hoursAgo(4)));
        projects.add(build("glnc CLI", "Multi-chain wallet tracking and gas monitoring in terminal",
                "A command-line interface tool that tracks cryptocurrency wallets across multiple blockchains and monitors gas prices directly in your terminal.",
                "developer-tools", "fintech", "Free Portfolio Tracking", 512, 156, 11, 4.2, true, 0,
                hoursAgo(5)));
        projects.add(build("Wipperoz", "Create professional resumes and video profiles in minutes",
                "An all-in-one career platform that helps you create stunning resumes and video profiles, with AI-powered content suggestions and job matching.",
                "ai", "innovation", "Freemium Job search", 5487, 892, 93, 4.5, true, 13,
                hoursAgo(6)));
        projects.add(build("LeadBoxer Platform", "Embed B2B tracking and AI enrichment into your product",
                "Powerful B2B lead tracking and AI-powered data enrichment platform that identifies website visitors and provides actionable sales intelligence.",
                "analytics-monitoring", "innovation", "Freemium Data Enrichment", 917, 234, 21, 5.0, true, 0,
                hoursAgo(7)));

        // --- Yesterday Top ---
        projects.add(build("SkyChart: Airline Executive", "Aerobiz Inspired Airline CEO Tycoon Game",
                "A strategic airline management simulation game where you build and manage your own airline empire. Inspired by classic Aerobiz gameplay with modern graphics.",
                "gaming", "gaming", "Casual Gaming Gaming & Game Dev", 2952, 567, 11, 4.8, true, 1,
                daysAgo(1)));
        projects.add(build("Zensor Analytics", "AI-powered SEO reporting for agencies",
                "Automated SEO reporting platform powered by AI that generates comprehensive analytics reports for digital agencies, saving hours of manual work.",
                "analytics-monitoring", "ai-ml", "Free Analytics & Reporting", 1132, 289, 14, 4.8, true, 6,
                daysAgo(1)));
        projects.add(build("NetronEats Restaurant Platform", "100% FREE. Forever. 0% Commission Restaurant Platform.",
                "A completely free restaurant ordering and management platform with zero commission fees. Empowers restaurants to take control of their online orders.",
                "automation-workflow", "social-impact", "Free Food Delivery", 1016, 312, 41, 4.0, true, 1,
                daysAgo(1)));
        projects.add(build("MOR - AI Resume Builder", "Build AI resumes with ATS analysis and job-based feedback",
                "An AI-powered resume builder that analyzes your resume against ATS systems and provides job-specific optimization feedback to improve interview chances.",
                "ai", "ai-ml", "Free Job Hunters", 925, 267, 22, 4.0, false, 1,
                daysAgo(1)));
        projects.add(build("PDF Translator Pro", "Translate your PDF Word Excel and PowerPoint documents",
                "Professional document translation service supporting PDF, Word, Excel, and PowerPoint files with support for 100+ languages while preserving formatting.",
                "productivity", "open", "Translation File Sharing", 1426, 389, 42, 4.5, true, 2,
                daysAgo(1)));
        projects.add(build("Memex AI", "The decision layer for AI-native software teams",
                "A powerful decision intelligence platform designed for AI-native software teams to collaborate, document decisions, and maintain context across projects.",
                "ai", "ai-ml", "AI Agents AI Code Assistant", 8066, 1234, 44, 5.0, true, 5,
                daysAgo(1)));

        // --- This Week Top ---
        projects.add(build("ProspectB2B", "Manage B2B prospecting with tasks and Kanban pipelines",
                "A comprehensive B2B sales prospecting tool with task management, Kanban pipelines, and lead tracking to help sales teams close more deals.",
                "automation-workflow", "innovation", "Lead Generation Task Management", 82112, 4567, 146, 4.9, true, 25,
                daysAgo(4)));
        projects.add(build("PricePush", "Localize App Store and Google Play prices in one click",
                "Automatically localize your app pricing across App Store and Google Play for all global markets with a single click, optimizing for local purchasing power.",
                "developer-tools", "fintech", "Subscription Management Workflow Automation", 2741, 567, 68, 5.0, true, 5,
                daysAgo(3)));
        projects.add(build("Waypoint: AI Trip Planner", "Trips that fit you",
                "An AI-powered travel planner that creates personalized trip itineraries based on your preferences, budget, and travel style.",
                "ai", "ai-ml", "Freemium Trip Planning", 714, 198, 41, 4.0, true, 1,
                daysAgo(5)));
        projects.add(build("KormaDesk", "Run four frontier AI models to analyze your next trade",
                "Advanced trading analysis platform that runs four frontier AI models simultaneously to provide multi-perspective insights on your next trade.",
                "finance-trading", "ai-ml", "Trading AI Analytics", 5554, 987, 45, 5.0, true, 7,
                daysAgo(2)));

        // --- This Month Top ---
        projects.add(build("CliqSpy", "Build your own ad intelligence radar",
                "A powerful ad intelligence platform that lets you spy on competitor ads, analyze ad strategies, and build your own competitive intelligence radar.",
                "marketing-seo", "innovation", "Freemium Competitor Analysis", 397354, 8765, 1059, 4.9, true, 31,
                daysAgo(15)));
        projects.add(build("Lodgestory", "Unify your customer engagement in one omnichannel inbox",
                "A unified customer engagement platform that consolidates all communication channels — email, chat, social, SMS — into one intelligent omnichannel inbox.",
                "automation-workflow", "innovation", "Freemium Customer Support", 159159, 5432, 1003, 4.7, true, 27,
                daysAgo(20)));

        // --- Today's Launches (from peerpush.net) ---
        projects.add(build("ColocNow", "Find colocation and shared housing across France",
                "A platform that helps people find colocation and shared housing opportunities across France with verified listings and roommate matching.",
                "automation-workflow", "open", "Free Product Discovery", 22, 45, 14, 4.0, true, 0,
                hoursAgo(10)));
        projects.add(build("Mindvaults", "Turn expert knowledge into answers for your problem",
                "A knowledge management platform that captures expert knowledge and transforms it into actionable answers for your specific business problems.",
                "ai", "ai-ml", "Freemium Skill Building", 55, 78, 11, 5.0, true, 0,
                hoursAgo(11)));
        projects.add(build("Random Profiles API", "Generate fake user and company data for development",
                "A developer API that generates realistic fake user profiles and company data for testing and development purposes with customizable data fields.",
                "developer-tools", "open", "Freemium Testing & QA", 47, 89, 1, 4.0, true, 0,
                hoursAgo(12)));
        projects.add(build("AISelfie", "Turn your selfie into any scene with AI",
                "Transform your selfies into stunning AI-generated scenes — from fantasy worlds to professional headshots — using advanced image generation models.",
                "ai", "ai-ml", "Freemium Image Generation", 68, 134, 2, 4.0, true, 1,
                hoursAgo(13)));
        projects.add(build("Amawish", "Create personalized birthday cards and invitations",
                "Design beautiful, personalized birthday cards and event invitations with an intuitive drag-and-drop editor and a library of templates.",
                "content-creation", "open", "Graphic Design Content Creation", 67, 112, 1, 4.0, true, 1,
                hoursAgo(14)));
        projects.add(build("SecondNumber", "Get a dedicated second business number for your cell phone",
                "Add a second phone number to your existing cell phone for business calls, keeping your personal and professional communications separate.",
                "productivity", "open", "Customer Support Cold Call", 56, 98, 1, 4.0, true, 0,
                hoursAgo(15)));
        projects.add(build("BewertungsFlow", "Automate Google reviews",
                "Automatically collect and manage Google reviews for your business with intelligent workflows that boost your online reputation.",
                "marketing-seo", "open", "Freemium Feedback Collection", 46, 76, 1, 4.0, true, 0,
                hoursAgo(16)));
        projects.add(build("NoClick", "Build scalable AI agents and automations for your business",
                "A no-code platform for building and deploying scalable AI agents and business automations without writing a single line of code.",
                "ai", "ai-ml", "AI Agents AI Automation", 34, 67, 1, 4.0, true, 0,
                hoursAgo(17)));
        projects.add(build("Tool Ignite", "Spark your search for top SaaS tools",
                "A curated discovery platform that helps you find and compare the best SaaS tools for your specific business needs across hundreds of categories.",
                "developer-tools", "open", "Free Productivity & Notes", 23, 54, 1, 4.0, false, 0,
                hoursAgo(18)));
        projects.add(build("Conversion Probe", "Get a free landing page audit in about a minute",
                "Submit your landing page URL and get a comprehensive audit report with actionable conversion optimization recommendations in under 60 seconds.",
                "marketing-seo", "open", "Free Landing Pages", 23, 56, 1, 4.0, true, 1,
                hoursAgo(19)));
        projects.add(build("Somio AI", "Create AI songs and instrumentals from text or lyrics",
                "An AI music creation platform that generates original songs and instrumentals from your text descriptions or lyrics using advanced audio generation models.",
                "content-creation", "ai-ml", "Freemium Content Creation", 23, 48, 1, 4.0, false, 0,
                hoursAgo(20)));
        projects.add(build("reverscan", "Reverse file search for Mac using content and screenshots",
                "A powerful Mac utility that lets you search for files by describing their content or uploading screenshots — no more digging through folders.",
                "developer-tools", "open", "Freemium Knowledge Base", 22, 44, 1, 4.0, false, 1,
                hoursAgo(21)));
        projects.add(build("Clausify", "AI-powered contract analysis for freelancers",
                "An AI tool that analyzes contracts and legal documents for freelancers, highlighting key terms, risks, and negotiation opportunities.",
                "ai", "ai-ml", "Freemium Data Analysis", 22, 52, 1, 4.0, false, 1,
                hoursAgo(22)));
        projects.add(build("SyncWhen", "Find the best time to meet. No signup, no ads, no clutter.",
                "A minimal meeting scheduler that helps groups find the optimal meeting time across time zones with zero friction — no accounts needed.",
                "productivity", "open", "Free Schedule group meetings", 34, 78, 1, 4.0, true, 1,
                hoursAgo(23)));
        projects.add(build("NicheScout", "Own Your Niche",
                "A market research tool that helps you identify and analyze profitable niches with competitive intelligence, keyword data, and trend analysis.",
                "marketing-seo", "open", "Competitor Analysis Data Analysis", 23, 45, 1, 4.0, true, 1,
                hoursAgo(24)));
        projects.add(build("ScrollLaunch", "Launch products and climb weekly rankings for indie makers",
                "A product launch platform designed for indie makers to showcase new products, compete in weekly rankings, and get discovered by early adopters.",
                "automation-workflow", "innovation", "Freemium Product Launch", 23, 56, 1, 4.0, true, 1,
                hoursAgo(25)));
        projects.add(build("Numi", "More meetings. More deals. From the reps you already have",
                "A sales acceleration platform that helps your existing sales team book more meetings and close more deals without hiring additional reps.",
                "automation-workflow", "innovation", "Freemium Sales Prospecting", 66, 123, 5, 4.0, true, 7,
                hoursAgo(26)));
        projects.add(build("CVoria", "Turn your CV into job offers with AI",
                "An AI-powered CV optimization tool that analyzes your resume against job descriptions and rewrites it to maximize interview callback rates.",
                "ai", "ai-ml", "Freemium Job search", 34, 87, 1, 5.0, true, 0,
                hoursAgo(27)));
        projects.add(build("Peptide Calculator", "Calculate precise peptide dosages",
                "A specialized calculator for accurately determining peptide dosages for research and wellness applications with built-in safety checks.",
                "health-wellness", "open", "Free Health & Wellness", 33, 56, 1, 4.0, true, 1,
                hoursAgo(28)));
        projects.add(build("ForexCracked", "Free Forex EA and indicator download library",
                "A comprehensive library of free Forex Expert Advisors and trading indicators for MetaTrader platforms, curated by professional traders.",
                "finance-trading", "fintech", "Free Trading", 33, 89, 1, 5.0, true, 0,
                hoursAgo(29)));
        projects.add(build("Skuno", "AI-powered warehouse and retail for Dynamics 365",
                "An AI-driven warehouse management and retail operations solution that integrates seamlessly with Microsoft Dynamics 365 for intelligent inventory control.",
                "ai", "ai-ml", "Data Integration Analytics & Reporting", 67, 134, 1, 5.0, true, 0,
                hoursAgo(30)));
        projects.add(build("Worksheetly", "Create beautiful, print-ready worksheets with AI",
                "Generate professional, printable worksheets in seconds using AI. Perfect for teachers, tutors, and parents creating educational materials.",
                "education-learning", "ai-ml", "Education & Learning", 34, 56, 1, 5.0, true, 0,
                hoursAgo(31)));
        projects.add(build("StockCar", "Turn your portfolio into a personalized AI podcast",
                "Transform your investment portfolio into a custom daily AI-generated podcast that discusses your holdings, market movements, and relevant news.",
                "finance-trading", "ai-ml", "Free AI Voice Generation", 22, 45, 1, 4.0, false, 1,
                hoursAgo(32)));
        projects.add(build("ClawGlow", "Deploy autonomous AI agents in seconds",
                "A platform that lets you deploy fully autonomous AI agents for your business in seconds — no infrastructure setup, no code, instant results.",
                "ai", "ai-ml", "AI Agents AI Automation", 33, 67, 1, 5.0, true, 0,
                hoursAgo(33)));

        // Map project logos by index (files are 01-42 matching seed order)
        String[] logoFiles = {
            "01_SikkerKey.svg","02_NeshysPR.svg","03_Avif2JPG.svg","04_glncCLI.svg",
            "05_Wipperoz.svg","06_LeadBoxer.svg","07_ColocNow.svg","08_Mindvaults.svg",
            "09_RandomProfilesAPI.svg","10_AISelfie.svg","11_Amawish.svg","12_SecondNumber.svg",
            "13_BewertungsFlow.svg","14_NoClick.svg","15_ToolIgnite.svg","16_ConversionProbe.svg",
            "17_SomioAI.svg","18_reverscan.svg","19_Clausify.svg","20_SyncWhen.svg",
            "21_NicheScout.svg","22_MemexAI.svg","23_PDFTranslatorPro.svg","24_MOR.svg",
            "25_NetronEats.svg","26_ZensorAnalytics.svg","27_SkyChart.svg","28_ScrollLaunch.svg",
            "29_Numi.svg","30_CVoria.svg","31_PeptideCalculator.svg","32_ForexCracked.svg",
            "33_Skuno.svg","34_Worksheetly.svg","35_StockCar.svg","36_ClawGlow.svg",
            "37_KormaDesk.svg","38_PricePush.svg","39_ProspectB2B.svg","40_Waypoint.svg",
            "41_CliqSpy.svg","42_Lodgestory.svg"
        };
        for (int i = 0; i < Math.min(projects.size(), logoFiles.length); i++) {
            projects.get(i).setLogoImage("/projects/" + logoFiles[i]);
        }

        projectRepo.saveAll(projects);
        return projects.size();
    }

    private int seedComments() {
        List<Project> allProjects = projectRepo.findAll();
        if (allProjects.isEmpty()) return 0;

        List<Comment> comments = new ArrayList<>();
        Random rand = new Random(99);

        String[] sampleComments = {
            "This is incredible! The innovation here is exactly what South Africa needs.",
            "Great work team! Love the approach to solving this problem.",
            "Been following this project since launch. Amazing progress!",
            "The UX on this is super clean. Well done!",
            "This could be huge for the African market. Rooting for you!",
            "Fantastic execution. The tech stack choice is spot on.",
            "Just voted! This deserves to be at the top.",
            "Really impressed with the attention to detail here.",
            "As a fellow builder, this is truly inspiring work.",
            "The demo video really shows off the potential. Excellent!",
            "South African tech at its finest. Proud of this team!",
            "Would love to see this expand to other African countries.",
            "Clean code, great design, real impact. 10/10.",
            "This solves a problem I've personally faced. Thank you!",
            "The pitch is solid. Looking forward to seeing this grow.",
            "Innovative use of AI. This is the future of our industry.",
        };

        String[] userNames = {"ThaboM", "LeratoK", "SiphoD", "NalediP", "BonganiZ",
            "ZaneleN", "MandlaS", "PreciousM", "KagisoT", "TebogoR"};

        int commentCount = 0;
        for (Project p : allProjects) {
            int numComments = rand.nextInt(5) + (p.getInnovationScore() > 20 ? 3 : 0);
            for (int i = 0; i < numComments && i < 10; i++) {
                Comment c = new Comment(
                    p.getId(),
                    "user-" + (rand.nextInt(999) + 100),
                    userNames[rand.nextInt(userNames.length)],
                    sampleComments[rand.nextInt(sampleComments.length)]
                );
                c.setCreatedAt(p.getCreatedAt().plus(java.time.Duration.ofHours(rand.nextInt(48) + 1)));
                comments.add(c);
                commentCount++;
            }
            p.setCommentsCount(numComments);
        }

        commentRepo.saveAll(comments);
        projectRepo.saveAll(allProjects);
        return commentCount;
    }

    private int seedUsers() {
        String pass = passwordEncoder.encode("student123");
        String[] avatarColors = {
            "E74C3C","3498DB","2ECC71","F39C12","9B59B6",
            "1ABC9C","E67E22","2980B9","D35400","16A085",
            "C0392B","27AE60","8E44AD","F1C40F","7F8C8D",
            "2C3E50","D35400","FF6B00","003A70","D0021B",
            "7B2D8E","00A3E0","FFC107","1A3A5C","009639"
        };
        String[][] studentData = {
            {"Zandile", "Sosiba", "222880416", "222880416@tut4life.ac.za", "Zandile2003"},
            {"Mbongeni", "Mokoena", "222277914", "222277914@tut4life.ac.za", "Koena369"},
            {"Lesego", "Lekwene", "222588138", "222588138@tut4life.ac.za", "LesegoLKW"},
            {"Amanda Cecilia", "Mngadi", "223877010", "223877010@tut4life.ac.za", "AmandaMngadi"},
            {"Khomanani", "Vumane", "240516594", "240516594@tut4life.ac.za", "khomiVumane"},
            {"Ayuba salimo", "Shabangu", "223174230", "223174230@tut4life.ac.za", "Ayuba"},
            {"Thandeka", "Shongwe", "223912192", "223912192@tut4life.ac.za", "ThandekaShongwe"},
            {"Sinazo", "Mtwentula", "220472000", "220472000@tut4life.ac.za", "Mtwentula"},
            {"Falakhe", "Shabangu", "222483123", "222483123@tut4life.ac.za", "Falakheshabangu"},
            {"Lintshiwe Pontsho", "Ntoampi", "221651685", "221651685@tut4life.ac.za", "lintshiwe"},
        };
        int count = 0;
        for (String[] s : studentData) {
            if (userRepo.findByEmail(s[3]).isPresent()) continue;
            User u = new User(s[0] + " " + s[1], s[3], pass, "Tshwane University of Technology", false);
            u.setBio("Student at TUT | GitHub: @" + s[4]);
            u.setAvatarUrl("https://ui-avatars.com/api/?name=" + s[0].replace(" ", "+") + "+" + s[1] + "&background=" + avatarColors[count % avatarColors.length] + "&color=fff&size=128&bold=true");
            userRepo.save(u);
            count++;
        }
        return count;
    }

    private Project build(String name, String tagline, String description,
                          String category, String track, String techStack,
                          int upvotes, int views, int innovationScore, double rating,
                          boolean trending, int commentsCount, Instant createdAt) {
        Project p = new Project();
        p.setName(name);
        p.setTagline(tagline);
        p.setDescription(description);
        p.setCategory(category);
        p.setTrack(track);
        p.setTechStack(techStack);
        p.setUpvotes(upvotes);
        p.setViews(views);
        p.setInnovationScore(innovationScore);
        p.setRating(rating);
        p.setTrending(trending);
        p.setCommentsCount(commentsCount);
        p.setCreatedAt(createdAt);
        p.setUpdatedAt(createdAt);
        p.setLogoColor(randomColor(name));
        p.setLogoInitial(name.substring(0, 1));
        p.setHasVideo(upvotes > 500);
        p.setFeatured(innovationScore > 40);
        p.setUserId("seed");
        p.setUserName("Innovation Lab");
        p.setDemoUrl("https://peerpush.net");
        p.setInstitution("Innovation Lab Community");
        p.setTeamName(name);
        p.setTeamSize(1);
        return p;
    }

    private Instant hoursAgo(int hours) {
        return Instant.now().minus(java.time.Duration.ofHours(hours));
    }

    private Instant daysAgo(int days) {
        return Instant.now().minus(java.time.Duration.ofDays(days));
    }

    private String randomColor(String seed) {
        String[] colors = {"#009639", "#FF6B00", "#003A70", "#D0021B", "#7B2D8E",
                "#00A3E0", "#FFC107", "#1A3A5C", "#E84A5F", "#2ECC71",
                "#3498DB", "#E67E22", "#9B59B6", "#1ABC9C", "#F39C12", "#E74C3C"};
        return colors[Math.abs(seed.hashCode()) % colors.length];
    }
}
