import { useState } from "react";

import { getCropIcon } from "../utils/cropIcons";

import styles from "./CropImage.module.css";


// =========================================================
// Looks for /crop-images/<crop>.jpg in the public folder.
// Falls back to the crop's emoji icon if no image exists yet
// — drop real photos into krishi-front/public/crop-images/
// (named exactly after the crop, e.g. rice.jpg, maize.jpg)
// to have them show up automatically, no code changes needed.
// =========================================================

export default function CropImage({ crop, className = "" }) {

  const [errored, setErrored] = useState(false);


  if (errored) {

    return (
      <div className={`${styles.placeholder} ${className}`}>
        <span className={styles.placeholderIcon}>
          {getCropIcon(crop)}
        </span>
      </div>
    );
  }


  return (
    <img
      src={`/crop-images/${crop}.jpg`}
      alt={crop}
      className={`${styles.image} ${className}`}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}