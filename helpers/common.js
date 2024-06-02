import { Dimensions } from "react-native";
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const wp = percentage => {
  const width = deviceWidth;
  return (percentage * width) / 100;
};

export const hp = percentage => {
  const height = deviceHeight;
  return (percentage * height) / 100;
};

export const getColumnCount = ()=>{
  if(deviceWidth >= 1024){
    //Desktop
    return 4;
  }else if(deviceWidth >= 768){
    //Tablet
    return 3
  }else{
    //Phone
    return 2
  }
}

export const getImageSize = (height,width)=>{
  if(width>height){
    //Landscape
    return 250;
  }else if (width<height){
    //Portrait
    return 300;
  }else{
    //Square
    return 200;
  }
}

export const capitalize = str=>{
  return str.replace(/\b\w/g, l =>l.toUpperCase())
}
