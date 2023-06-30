export function showLocationDetail(location: any) {
    const name = location.properties.name;
    const listul = document.getElementById("listul") as HTMLDivElement;
    if (listul) {
      listul.innerHTML = name;
    }
  
    const img = location.properties.image_url_2;
    const imgAddress = document.getElementById("img-address") as HTMLImageElement;
    if (imgAddress) {
      imgAddress.src = img;
    }
  
    const desc = location.properties.desc;
    const accordionex = document.getElementById("accordionex") as HTMLDivElement;
    if (accordionex) {
      accordionex.innerHTML = desc;
    }
  
    openRightPanel();
  }
export function openRightPanel() {
    const elm = document.querySelector<HTMLElement>(".wrapper .right-panel");
    if (elm) {
      elm.style.transform = "translateX(0%)";
    }
  }
export  function closeRightPanel() {
  document.getElementById('closeRight')?.addEventListener('click', function() {
    const elm = document.querySelector<HTMLElement>(".wrapper .right-panel");
    if (elm) {
      elm.style.transform = "translateX(100%)";
    }
  });
}