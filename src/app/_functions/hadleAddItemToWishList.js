export const handleAddItemToWishList = (id, setWishList) => {
  // console.log(id)

  try {
    let wishList = JSON.parse(localStorage.getItem('fav'));
    if (wishList.includes(id)) {
      wishList = wishList.filter((item) => item !== id);
      localStorage.setItem('fav', JSON.stringify(wishList));
      setWishList(wishList);
    } else {
      wishList.push(id);

      localStorage.setItem('fav', JSON.stringify(wishList));
      setWishList(wishList);
    }
  } catch (error) {
    localStorage.setItem('fav', JSON.stringify([]));

    setWishList([]);
    console.log(error);
  }
};
