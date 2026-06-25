// app/admin/messages/page.tsx
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Mail, Calendar } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-800">
            Messages
          </h1>
          <p className="text-sm sm:text-base text-earth-500 mt-1">
            {messages.length} message{messages.length > 1 ? "s" : ""} reçu{messages.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-earth-500 bg-cream-100 px-3 py-1.5 rounded-full">
            ✉️ {messages.length}
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-peach-light/30 flex items-center justify-center mx-auto mb-4">
            <Mail size={40} className="text-peach" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-earth-800 mb-2">
            Aucun message
          </h3>
          <p className="text-earth-500 text-sm">
            Les messages du formulaire de contact apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-earth-800 text-lg">
                      {message.name || "Anonyme"}
                    </h3>
                    <span className="text-xs text-earth-400 bg-cream-100 px-2 py-0.5 rounded-full">
                      {message.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-earth-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 text-earth-600 leading-relaxed whitespace-pre-line border-t border-earth-100 pt-3">
                    {message.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${message.email}`}
                    className="p-2 text-earth-500 hover:text-peach hover:bg-peach-light/20 rounded-lg transition-colors"
                    aria-label="Répondre par email"
                  >
                    <Mail size={18} />
                  </a>
                  <DeleteButton endpoint={`/api/contact/${message.id}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}