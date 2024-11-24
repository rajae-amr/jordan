import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">خدمات الأردن</h3>
            <p className="text-sm">
              منصتك الأولى للعثور على أفضل مقدمي الخدمات في الأردن
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  سجل كمقدم خدمة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">الخدمات</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/education" className="hover:text-white">
                  التعليم الخصوصي
                </Link>
              </li>
              <li>
                <Link href="/services/physiotherapy" className="hover:text-white">
                  العلاج الطبيعي
                </Link>
              </li>
              <li>
                <Link href="/services/homecare" className="hover:text-white">
                  الرعاية المنزلية
                </Link>
              </li>
              <li>
                <Link href="/services/psychology" className="hover:text-white">
                  العلاج النفسي
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">تواصل معنا</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} خدمات الأردن. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}