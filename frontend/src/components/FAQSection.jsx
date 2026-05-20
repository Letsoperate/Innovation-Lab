import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const FAQSection = () => {
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    api.get("/faq").then((res) => setFaqData(res.data)).catch(console.error);
  }, []);

  if (faqData.length === 0) return null;

  return (
    <div className="py-8 border-t border-gray-100">
      <h2 className="text-lg font-bold text-[#111827] mb-5">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((faq, index) => (
          <AccordionItem key={faq.id || index} value={`item-${index}`} className="border-b border-gray-100">
            <AccordionTrigger className="text-sm font-medium text-[#111827] hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
