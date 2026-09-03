import { useRef, useState } from "react";

import styles from "./LeafImageUpload.module.css";


const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB


export default function LeafImageUpload({
  previewUrl,
  onFileSelected,
  onError,
}) {

  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);


  function validateAndEmit(file) {

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      onError("That image is over 10 MB — please upload a smaller file.");
      return;
    }

    onFileSelected(file);
  }


  function handleInputChange(event) {

    const file = event.target.files?.[0];

    validateAndEmit(file);

    // allow re-selecting the same file later
    event.target.value = "";
  }


  function handleDrop(event) {

    event.preventDefault();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    validateAndEmit(file);
  }


  return (
    <div className={styles.field}>

      <div className={styles.labelRow}>
        <span className={styles.labelIcon}>⬆</span>
        <span className={styles.label}>Upload leaf image</span>
      </div>

      <p className={styles.hint}>
        Supported: JPG, PNG, WEBP — max 10 MB
      </p>

      <button
        type="button"
        className={[
          styles.dropzone,
          dragActive ? styles.dropzoneActive : "",
          previewUrl ? styles.dropzoneFilled : "",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >

        {previewUrl ? (

          <img
            src={previewUrl}
            alt="Selected leaf preview"
            className={styles.previewImage}
          />

        ) : (

          <div className={styles.dropzonePlaceholder}>
            <span className={styles.dropzoneIcon}>🍃</span>
            <span className={styles.dropzoneText}>
              Click to browse or drag a photo here
            </span>
          </div>
        )}

      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />

    </div>
  );
}