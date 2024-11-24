export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">عن خدمات الأردن</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">من نحن</h2>
            <p className="text-gray-600 mb-6">
              خدمات الأردن هي منصة رائدة تجمع بين مقدمي الخدمات المهنية والعملاء في الأردن. نهدف إلى تسهيل الوصول إلى خدمات عالية الجودة في مجالات التعليم، الصحة، والرعاية المنزلية.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">رؤيتنا</h2>
            <p className="text-gray-600 mb-6">
              نسعى لأن نكون المنصة الأولى والأكثر موثوقية في الأردن لربط المهنيين المؤهلين مع العملاء الباحثين عن خدمات عالية الجودة.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">مميزاتنا</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <span className="ml-2 text-primary">•</span>
                خدمات متنوعة تلبي احتياجات مختلف شرائح المجتمع
              </li>
              <li className="flex items-center">
                <span className="ml-2 text-primary">•</span>
                مقدمو خدمات مؤهلون وذوو خبرة
              </li>
              <li className="flex items-center">
                <span className="ml-2 text-primary">•</span>
                نظام تقييم شفاف وموثوق
              </li>
              <li className="flex items-center">
                <span className="ml-2 text-primary">•</span>
                تسجيل مجاني لمقدمي الخدمات
              </li>
              <li className="flex items-center">
                <span className="ml-2 text-primary">•</span>
                دعم فني على مدار الساعة
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}