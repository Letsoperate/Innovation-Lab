import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Code2,
  Upload,
  ThumbsUp,
  Trophy,
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  Calendar,
  Video,
  Play,
  Rocket,
} from "lucide-react";

const stepIcons = [
  <UserPlus className="w-6 h-6" />,
  <Code2 className="w-6 h-6" />,
  <Upload className="w-6 h-6" />,
  <ThumbsUp className="w-6 h-6" />,
  <Trophy className="w-6 h-6" />,
];

const howItWorksSteps = [
  { step: 1, title: "Register Your Team", description: "Create a free account, form your team (1-4 members), and verify your institutional affiliation. Registration takes less than 5 minutes." },
  { step: 2, title: "Build Your Project", description: "Use innovation techniques and AI tools to build something amazing. There are no restrictions on tech stack — use whatever gets you in the zone." },
  { step: 3, title: "Submit & Launch", description: "Submit your project with a description, demo video, screenshots, and tech stack details. Your project goes live for community voting immediately." },
  { step: 4, title: "Get Votes & Feedback", description: "The community votes on projects. Engage with other builders, get feedback, iterate on your project, and climb the rankings." },
  { step: 5, title: "Win Prizes", description: "Top projects advance to finals judged by industry experts. Winners receive cash prizes, mentorship, incubation, and more." },
];

const competitionTimeline = (() => {
  const now = new Date();
  const regStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const regEnd = new Date(regStart.getTime() + 14 * 86400000);
  const buildEnd = new Date(regStart.getFullYear(), 6, 15);
  const voteEnd = new Date(regStart.getFullYear(), 6, 31);
  const semiStart = new Date(regStart.getFullYear(), 7, 1);
  const semiEnd = new Date(regStart.getFullYear(), 7, 7);
  const finals = new Date(regStart.getFullYear(), 7, 15);
  
  const fmt = (d) => d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  const status = (start, end) => now < start ? "upcoming" : now > (end || start) ? "completed" : "active";
  
  return [
    { phase: "Registration Open", date: `${fmt(regStart)} - ${fmt(regEnd)}`, status: status(regStart, regEnd) },
    { phase: "Building Phase", date: `${fmt(regEnd)} - ${fmt(buildEnd)}`, status: status(regEnd, buildEnd) },
    { phase: "Community Voting", date: `${fmt(regEnd)} - ${fmt(voteEnd)}`, status: status(regEnd, voteEnd) },
    { phase: "Semi-Finals", date: `${fmt(semiStart)} - ${fmt(semiEnd)}`, status: status(semiStart, semiEnd) },
    { phase: "Finals & Awards", date: fmt(finals), status: status(finals) },
  ];
})();

const HowItWorksPage = () => {
  useEffect(() => { document.title = "How It Works — Innovation Lab"; }, []);
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-4">
          How the Competition Works
        </h1>
        <p className="text-base text-gray-600 max-w-lg mx-auto">
          From registration to winning — here's everything you need to know
          about South Africa's premier innovation competition.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto">
      <div className="space-y-6 mb-16">
        {howItWorksSteps.map((step, index) => (
          <div
            key={step.step}
            className="flex gap-5 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 bg-[#009639]/10 rounded-xl flex items-center justify-center text-[#009639] shrink-0">
              {stepIcons[index]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#009639] uppercase">
                  Step {step.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-purple-800 mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#009639]" />
          <h2 className="text-xl font-bold text-purple-800">Competition Timeline</h2>
        </div>
        <div className="space-y-0">
          {competitionTimeline.map((event, index) => (
            <div key={index} className="flex items-start gap-4 pb-6 relative">
              {/* Vertical line */}
              {index < competitionTimeline.length - 1 && (
                <div className="absolute left-[15px] top-8 w-0.5 h-[calc(100%-16px)] bg-gray-200" />
              )}
              {/* Icon */}
              <div className="relative z-10 shrink-0">
                {event.status === "completed" && (
                  <CheckCircle className="w-8 h-8 text-[#009639]" />
                )}
                {event.status === "active" && (
                  <div className="w-8 h-8 bg-[#009639] rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                )}
                {event.status === "upcoming" && (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}
              </div>
              {/* Content */}
              <div className="pt-1">
                <h4
                  className={`text-sm font-semibold ${
                    event.status === "active"
                      ? "text-[#009639]"
                      : event.status === "completed"
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {event.phase}
                  {event.status === "active" && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-[#009639]/10 text-[#009639] rounded-full">
                      <span className="w-1.5 h-1.5 bg-[#009639] rounded-full animate-pulse" />
                      Active
                    </span>
                  )}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prizes Section */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-purple-800">Prizes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-amber-600 uppercase mb-1">Grand Prize</div>
            <div className="text-2xl font-bold text-purple-800">R150,000</div>
            <div className="text-xs text-gray-500 mt-1">+ 6-month incubation</div>
          </div>
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl text-center">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">1st Runner-Up</div>
            <div className="text-2xl font-bold text-purple-800">R100,000</div>
            <div className="text-xs text-gray-500 mt-1">+ cloud credits</div>
          </div>
          <div className="p-6 bg-gradient-to-b from-orange-50 to-white border border-orange-200 rounded-xl text-center">
            <div className="text-xs font-bold text-orange-500 uppercase mb-1">2nd Runner-Up</div>
            <div className="text-2xl font-bold text-purple-800">R75,000</div>
            <div className="text-xs text-gray-500 mt-1">+ mentorship</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#009639]/5 border border-[#009639]/20 rounded-xl text-center">
          <div className="text-sm font-semibold text-[#009639]">Track Winners: R25,000 each</div>
          <div className="text-xs text-gray-600 mt-1">+ internship opportunities with sponsor companies</div>
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="mb-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Video className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Tutorial Videos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
            <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 h-40 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-purple-800 mb-1">How to Use the Platform</h3>
              <p className="text-xs text-gray-500">Learn how to navigate Innovation Lab, submit projects, browse the leaderboard, and make the most of your experience.</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-purple-600">Watch tutorial <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
            <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 h-40 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-purple-800 mb-1">How to Earn Points</h3>
              <p className="text-xs text-gray-500">Discover how the Innovation Score works — upvoting, commenting, sharing, and engaging with the community to boost your ranking.</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-purple-600">Watch tutorial <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
            <div className="relative bg-gradient-to-br from-green-500 to-green-700 h-40 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-purple-800 mb-1">How Winners Are Announced</h3>
              <p className="text-xs text-gray-500">Understand the judging process, how daily/weekly/monthly winners are selected, and what happens at the finals awards ceremony.</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-purple-600">Watch tutorial <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Submit Your Project <Upload className="w-4 h-4" />
        </Link>
      </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
