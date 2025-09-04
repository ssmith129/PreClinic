import { img_path } from '../../environment';


interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
}

const ImageWithBasePath = (props: Image) => {
  // Build full image src; respect absolute and data URLs
  const isAbsolute = /^(https?:)?\/\//.test(props.src) || props.src.startsWith("/") || props.src.startsWith("data:");
  const fullSrc = isAbsolute ? props.src : `${img_path}${props.src}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

export default ImageWithBasePath;
