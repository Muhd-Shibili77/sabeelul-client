export const convertImageToBase64 = (url) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
  });
