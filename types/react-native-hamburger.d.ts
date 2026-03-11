declare module "react-native-hamburger" {
  import { ComponentType } from "react";

  interface HamburgerProps {
    active?: boolean;
    type?: string;
    color?: string;
    onPress?: () => void;
  }

  const Hamburger: ComponentType<HamburgerProps>;
  export default Hamburger;
}
