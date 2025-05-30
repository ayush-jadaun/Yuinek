
import HeroImageSlider from "@/components/homepage/HeroImageSlider";
import ShopByCategory from "@/components/homepage/ShopByCategory";
import MidPageBannerSlider from "@/components/homepage/MidPageBannerSlider";
import AllProducts from "@/components/homepage/AllProducts";
import CustomerFeedback from "@/components/homepage/CustomerFeedback";
// import Footer from "@/components/Footer"; // If you have one

export default function Home() {
  return (
    <>

      <main>
        <HeroImageSlider />
        <ShopByCategory />
        <MidPageBannerSlider />
        <AllProducts />
        <CustomerFeedback />
      </main>
      {/* <Footer /> */}
    </>
  );
}
