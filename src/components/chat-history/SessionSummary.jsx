"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateSessionSummary } from "@/actions/chat/generate_summary";
import { getSessionMessages } from "@/actions/chat/messages";
import { SUMMARY_GENERATION } from "@/constants/chat";
import {
  LoadingSkeleton,
  SummaryDisplay,
  NoSummaryYet,
} from "./SessionSummaryParts";

const SessionSummary = ({ session }) => {
  const [summary, setSummary] = useState(session.summary || null);
  const [isInitialLoad, setIsInitialLoad] = useState(!session.summary);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const fetchAndGenerateSummary = async () => {
      const hasExistingSummary = !!session.summary;

      if (hasExistingSummary) {
        setSummary(session.summary);
        setIsInitialLoad(false);
        setIsUpdating(true);
      }

      try {
        const { data: messages, error: fetchError } = await getSessionMessages(
          session.id
        );

        if (fetchError) {
          toast.error("Unable to load conversation");
          setShouldShow(hasExistingSummary);
          setIsInitialLoad(false);
          setIsUpdating(false);
          return;
        }

        if (
          !messages ||
          messages.length < SUMMARY_GENERATION.MIN_MESSAGES_FOR_SUMMARY
        ) {
          setShouldShow(hasExistingSummary);
          setIsInitialLoad(false);
          setIsUpdating(false);
          return;
        }

        const result = await generateSessionSummary(session.id, messages);

        if (result.success) {
          setSummary(result.summary);
          setShouldShow(true);
        } else if (result.needsUpdate === false) {
          setShouldShow(!!summary);
        } else if (result.error) {
          if (!hasExistingSummary) {
            toast.error(result.error);
            setShouldShow(false);
          }
        }

        setIsInitialLoad(false);
        setIsUpdating(false);
      } catch (err) {
        console.error("[Session Summary] Error:", err);
        if (!hasExistingSummary) {
          toast.error("Failed to generate summary");
          setShouldShow(false);
        }
        setIsInitialLoad(false);
        setIsUpdating(false);
      }
    };

    fetchAndGenerateSummary();
  }, [session.id, session.summary, session.summarized_message_count]);

  if (!shouldShow && !isInitialLoad) {
    return <NoSummaryYet />;
  }

  if (isInitialLoad) {
    return <LoadingSkeleton />;
  }

  if (!summary) {
    return <NoSummaryYet />;
  }

  return <SummaryDisplay summary={summary} isUpdating={isUpdating} />;
};

export default SessionSummary;
