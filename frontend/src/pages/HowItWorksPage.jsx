import React from "react";
import { Link } from "react-router-dom";
import { howItWorksSteps, competitionTimeline } from "../data/mock";
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
  Zap,
  Calendar,
} from "lucide-react";

const stepIcons = [
  <UserPlus className="w-6 h-6" />,
  <Code2 className="w-6 h-6" />,
  <Upload className="w-6 h-6" />,
  <ThumbsUp className="w-6 h-6" />,
  <Trophy className="w-6 h-6" />,
];

const HowItWorksPage = () => {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#009639]/10 text-[#009639] text-xs font-medium rounded-full mb-4">
          <Zap className="w-3 h-3" /> Innovation Lab Competition
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
          How the Competition Works
        </h1>
        <p className="text-base text-gray-600 max-w-lg mx-auto">
          From registration to winning — here's everything you need to know
          about South Africa's premier innovation competition.
        </p>
      </div>

      {/* Steps */}
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
              <h3 className="text-lg font-bold text-[#111827] mb-1">
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
          <h2 className="text-xl font-bold text-[#111827]">Competition Timeline</h2>
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
          <h2 className="text-xl font-bold text-[#111827]">Prizes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-amber-600 uppercase mb-1">Grand Prize</div>
            <div className="text-2xl font-bold text-[#111827]">R150,000</div>
            <div className="text-xs text-gray-500 mt-1">+ 6-month incubation</div>
          </div>
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl text-center">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">1st Runner-Up</div>
            <div className="text-2xl font-bold text-[#111827]">R100,000</div>
            <div className="text-xs text-gray-500 mt-1">+ cloud credits</div>
          </div>
          <div className="p-6 bg-gradient-to-b from-orange-50 to-white border border-orange-200 rounded-xl text-center">
            <div className="text-xs font-bold text-orange-500 uppercase mb-1">2nd Runner-Up</div>
            <div className="text-2xl font-bold text-[#111827]">R75,000</div>
            <div className="text-xs text-gray-500 mt-1">+ mentorship</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#009639]/5 border border-[#009639]/20 rounded-xl text-center">
          <div className="text-sm font-semibold text-[#009639]">Track Winners: R25,000 each</div>
          <div className="text-xs text-gray-600 mt-1">+ internship opportunities with sponsor companies</div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#111827] rounded-xl hover:bg-[#1f2937] transition-colors"
        >
          Submit Your Project <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
