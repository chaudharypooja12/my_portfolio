import { NextResponse } from "next/server";

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();

    const { name, email, subject, message } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.EMAIL_SERVICE_API_KEY;
    const emailTo = process.env.EMAIL_TO;

    if (!apiKey || !emailTo) {
      console.error("Email service not configured. Missing environment variables.");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    // Email sending logic - configure with your preferred email service
    // Example with a generic email API:
    //
    // await fetch("https://api.emailservice.com/send", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     to: emailTo,
    //     from: process.env.EMAIL_FROM || email,
    //     subject: `[Portfolio Contact] ${subject}`,
    //     text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    //   }),
    // });

    // Log for development
    console.log("Contact form submission:", {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received. I will get back to you soon!",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
