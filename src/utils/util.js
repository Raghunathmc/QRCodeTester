export default class Util {
    static BOTTOM_NAVIGATION_APPROVED_URLS = [
        "/offers",
        "/product/",
        "/cart",
        "/checkout",
        "/account",
        "/home",
        "/product-listing",
        "/product-categories"
      ];
      static isBottomNavigationBarVisible(currentPathname) {
        let isVisible = false;
        this.BOTTOM_NAVIGATION_APPROVED_URLS.forEach(url => {
          if (currentPathname.indexOf(url) > -1) {
            isVisible = true;
          }
        });
        console.log(isVisible)
        return isVisible;
      }
}