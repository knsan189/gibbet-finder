import { useLayoutEffect, useState } from "react";

const moduleConfig: any = {
  wasmBinaryFile: "opencv_js.wasm",
  usingWasm: true,
};

const useOpencv = () => {
  const [cv, setCv] = useState<any>();

  useLayoutEffect(() => {
    if (window.Module || cv) {
      return;
    }

    moduleConfig.onRuntimeInitialized = () => {
      setCv(window.Module);
    };
    window.Module = moduleConfig;
  }, [cv]);

  return { cv };
};

export default useOpencv;
