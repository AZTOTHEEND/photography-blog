/* ===== Supabase 配置（占位常量） =====
 * 使用方法：
 * 1. 前往 https://supabase.com 注册并创建项目（免费档即可）
 * 2. 在项目 Settings → API 页面复制 Project URL 与 anon public key
 * 3. 填入下方两个常量并保存
 * 4. 按 README.md 中的说明创建数据库表 photos 与 Storage bucket（photos）
 * 注意：anon key 属于公开密钥，可安全放在前端；但务必按 README 配置好 RLS 策略，
 *       不要启用 "service_role" 密钥在前端使用（该密钥有全部权限）。
 */
const SUPABASE_URL = "https://fqauxfwakfurfxczrgch.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxYXV4Zndha2Z1cmZ4Y3pyZ2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzOTc0MDYsImV4cCI6MjEwODk3MzQwNn0.fBKefLuC9bQspi9xwjL2-DMeSJHmq6PuXKvel4nHnWM";
