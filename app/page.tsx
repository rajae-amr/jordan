import Hero from "@/components/home/Hero";
import ServiceCategories from "@/components/home/ServiceCategories";
import TopProvidersByCategory from "@/components/home/TopProvidersByCategory";
import HowItWorks from "@/components/home/HowItWorks";
import Statistics from "@/components/home/Statistics";

async function getStatistics() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/statistics`, {
      next: { revalidate: 300 }, // تحديث كل 5 دقائق
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    const data = await res.json();
    return data.statistics;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      members: 0,
      providers: 0,
      averageRating: 0,
      completedServices: 0
    };
  }
}

export default async function HomePage() {
  const statistics = await getStatistics();

  return (
    <>
      <Hero />
      <Statistics {...statistics} />
      <ServiceCategories />
      <TopProvidersByCategory />
      <HowItWorks />
    </>
  );
}