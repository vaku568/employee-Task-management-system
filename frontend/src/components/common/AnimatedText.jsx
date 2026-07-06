import {
  useEffect,
  useState
} from "react";

import {
  motion,
  AnimatePresence
} from "framer-motion";

const AnimatedText = ({
  texts
}) => {

  const [index, setIndex] =
    useState(0);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setIndex(
          (prev) =>
            (prev + 1) %
            texts.length
        );

      }, 2000);

    return () =>
      clearInterval(
        interval
      );

  }, [texts]);

  return (

    <AnimatePresence
      mode="wait"
    >

      <motion.span
        key={index}
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          y: -10
        }}
        transition={{
          duration: 0.4
        }}
      >
        {texts[index]}
      </motion.span>

    </AnimatePresence>

  );
};

export default AnimatedText;