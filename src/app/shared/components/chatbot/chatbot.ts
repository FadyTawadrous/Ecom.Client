import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ChatbotService } from "../../../core/services/chatbot.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class ChatbotComponent {

  opened = false;
  message = '';
  loading = false;

  result: any = null;
  cleanAnswer = '';
  tableHtml = '';

  constructor(private chatService: ChatbotService) {}

  toggleChat() {
    this.opened = !this.opened;
  }

  send() {
    if (!this.message.trim()) return;

    this.loading = true;
    this.result = null;
    this.cleanAnswer = '';
    this.tableHtml = '';

    this.chatService.sendMessage(this.message).subscribe({
      next: res => {
        const raw = res.result.answer || '';

        // ✅ Convert markdown table to HTML
        this.tableHtml = this.extractTable(raw);

        // ✅ Clean remaining markdown text
        this.cleanAnswer = this.removeMarkdown(raw);

        // ✅ Use structured products if exist
        this.result = res.result;

        this.loading = false;
      },
      error: () => {
        this.cleanAnswer = 'AI service failed 😢';
        this.loading = false;
      }
    });

    this.message = '';
  }


  // ✅ Extract markdown table
  extractTable(text: string): string {
    if (!text.includes('|')) return '';

    const lines = text.split('\n').filter(l => l.includes('|'));
    if (lines.length < 2) return '';

    let html = `<table class="w-full border border-gray-300 text-xs mt-2">`;

    lines.forEach((line, i) => {

      if (line.includes('---')) return;

      const cells = line.split('|').map(c => c.trim()).filter(Boolean);

      html += `<tr class="${i === 0 ? 'bg-slate-200 font-semibold' : 'hover:bg-indigo-50'}">`;

      cells.forEach((cell, index) => {

        // 🚫 Skip Product ID column
        if (index === 0) return;

        html += `<td class="border p-2">${cell}</td>`;
      });

      html += `</tr>`;
    });

    html += `</table>`;
    return html;
  }


  // ✅ Remove leftover markdown
  removeMarkdown(text: string) {
    return text
      .replace(/#+/g, '')
      .replace(/\*\*/g, '')
      .replace(/\|/g, '')
      .replace(/---/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

}
