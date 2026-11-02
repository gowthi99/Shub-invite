"use client";
import { isCoupleOccasion, type InviteData } from "@/lib/types";
import { getStrings } from "@/lib/i18n";
import { nameLabels } from "../constants";
import { SectionCard, TextArea, TextField } from "../ui";

export default function DetailsStep({
  data,
  update,
  errors,
}: {
  data: InviteData;
  update: (p: Partial<InviteData>) => void;
  errors: Record<string, string>;
}) {
  const s = getStrings(data.language);
  const labels = nameLabels(data.occasion);
  const couple = isCoupleOccasion(data.occasion);

  return (
    <div className="space-y-5">
      <SectionCard title={couple ? "The couple" : "Who's celebrating"}>
        <div className={couple ? "grid gap-4 sm:grid-cols-2" : ""}>
          <TextField
            label={labels.primary}
            value={data.primaryName}
            onChange={(v) => update({ primaryName: v })}
            placeholder={labels.primaryPlaceholder}
            error={errors.primaryName}
            autoComplete="off"
            maxLength={80}
            required
          />
          {couple && labels.secondary && (
            <TextField
              label={labels.secondary}
              value={data.secondaryName}
              onChange={(v) => update({ secondaryName: v })}
              placeholder={labels.secondaryPlaceholder}
              error={errors.secondaryName}
              autoComplete="off"
              maxLength={80}
            />
          )}
        </div>
        <TextField
          label="Hosted by"
          optional
          value={data.hostedBy}
          onChange={(v) => update({ hostedBy: v })}
          placeholder={couple ? "The Reddy & Sharma families" : "With love, the family"}
          error={errors.hostedBy}
          maxLength={160}
        />
      </SectionCard>

      <SectionCard title="Your words">
        <TextField
          label="Headline"
          optional
          value={data.title}
          onChange={(v) => update({ title: v })}
          placeholder={s.defaultTitle[data.occasion]}
          hint="Leave blank to use the suggested headline."
          error={errors.title}
          maxLength={160}
          lang={data.language}
        />
        <TextArea
          label="Invitation message"
          optional
          value={data.message}
          onChange={(v) => update({ message: v })}
          placeholder={s.defaultMessage[data.occasion]}
          hint="Leave blank to use the suggested message in the invitation language."
          error={errors.message}
          maxLength={1200}
          lang={data.language}
        />
      </SectionCard>

      <SectionCard title="Contact">
        <TextField
          label="Contact phone"
          optional
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={data.contactPhone}
          onChange={(v) => update({ contactPhone: v })}
          placeholder="+91 98765 43210"
          hint="Guests can tap to call or WhatsApp you."
          error={errors.contactPhone}
          maxLength={30}
        />
      </SectionCard>
    </div>
  );
}
