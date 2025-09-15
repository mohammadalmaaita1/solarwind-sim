# استخدام Node.js 18 كصورة أساسية
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package.json
COPY package*.json ./

# تثبيت المتطلبات
RUN npm ci --only=production

# نسخ كود التطبيق
COPY . .

# بناء التطبيق
RUN npm run build

# إنشاء مستخدم غير root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# تغيير ملكية الملفات
RUN chown -R nextjs:nodejs /app
USER nextjs

# فتح المنفذ
EXPOSE 9002

# متغيرات البيئة
ENV NODE_ENV=production
ENV PORT=9002

# تشغيل التطبيق
CMD ["npm", "start"]
