import { GiAirForce, GiAlienStare, GiAmericanFootballBall, GiBatMask, GiComputing, GiFlyingFlag, GiGhost, GiNinjaHeroicStance, GiRobotAntennas, GiSeaDragon, GiSkullCrossedBones, GiSoccerBall, GiTargetArrows, GiTrident, GiTrophy } from "react-icons/gi";
import Swal, { SweetAlertIcon } from "sweetalert2"

export const confirm = (icon: SweetAlertIcon, title: string) => {
  return Swal.fire({
    // title,
    // text,
    // confirmButtonText: confirm,
    // cancelButtonText: cancel,
    // icon: 'warning',
    // showCancelButton: true,
    // showClass: {
    //   popup: "animate__animated animate__fadeInLeftBig"
    // },
    // hideClass: {
    //   popup: "animate__animated animate__fadeOutLeftBig"
    // },
    // confirmButtonColor: "#1d6f42",
    // cancelButtonColor: "#c0392b",
    // customClass: {
    //   popup: 'notification-warning',
    //   title: 'title-warning',
    //   confirmButton: 'outline-none',
    //   cancelButton: 'outline-none'
    // },
  })
}
export const notify = (icon: SweetAlertIcon, title: string, className: 'danger' | 'success') => {
  return Swal.mixin({
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false,
    showClass: {
      popup: "animate__animated animate__slideInRight"
    },
    hideClass: {
      popup: "animate__animated animate__slideOutRight"
    },
    customClass: {
      popup: `bg__${className}`,
      title: `text__${className}`
    },
  }).fire(title, undefined, icon)
}

export const avatars = [GiAirForce, GiAmericanFootballBall, GiSoccerBall, GiAlienStare, GiBatMask, GiNinjaHeroicStance, GiSeaDragon, GiTrophy, GiTrident, GiSkullCrossedBones, GiFlyingFlag, GiComputing, GiRobotAntennas, GiTargetArrows, GiGhost]