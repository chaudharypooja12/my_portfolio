"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/sections/section-header";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ status: "loading", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormState({ status: "error", message: data.error || "Something went wrong." });
        return;
      }

      setFormState({ status: "success", message: data.message || "Message sent successfully!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState({ status: "error", message: "Failed to send message. Please try again." });
    }
  }

  return (
    <section id="contact" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nebula-2/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-2xl">
        <SectionHeader
          title="Get In Touch"
          description="Have a question or want to connect? Send me a message."
        />

        <div className="gradient-border">
          <div className="relative rounded-[var(--radius-xl)] bg-card/80 p-6 md:p-8">
            {formState.status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-success to-accent animate-float">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold gradient-text">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">{formState.message}</p>
                <Button
                  variant="outline"
                  onClick={() => setFormState({ status: "idle", message: "" })}
                  className="mt-2"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={`text-sm font-medium transition-colors ${
                        focusedField === "name" ? "text-primary" : ""
                      }`}
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_oklch(0.7_0.22_280/20%)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={`text-sm font-medium transition-colors ${
                        focusedField === "email" ? "text-primary" : ""
                      }`}
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_oklch(0.7_0.22_280/20%)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className={`text-sm font-medium transition-colors ${
                      focusedField === "subject" ? "text-primary" : ""
                    }`}
                  >
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, subject: e.target.value }))
                    }
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className="transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_oklch(0.7_0.22_280/20%)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className={`text-sm font-medium transition-colors ${
                      focusedField === "message" ? "text-primary" : ""
                    }`}
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="resize-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_oklch(0.7_0.22_280/20%)]"
                  />
                </div>

                {formState.status === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {formState.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="group relative w-full gap-2 h-11 overflow-hidden"
                  disabled={formState.status === "loading"}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-nebula-2 to-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {formState.status === "loading" ? (
                    <>
                      <Loader2 className="relative h-4 w-4 animate-spin" />
                      <span className="relative">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="relative h-4 w-4" />
                      <span className="relative">Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
