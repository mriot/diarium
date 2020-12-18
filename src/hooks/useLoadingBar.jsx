import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../atoms";

export default function useLoadingBar() {
  const setLoading = useSetRecoilState(loadingAtom);

  const addLoader = () => {
    // const id = Math.random();
    // setLoading(prev => [...prev, id]);
    // return id;
    setLoading(counter => counter + 1);
  };

  const removeLoader = () => {
    // setLoading(prev => {
    //   const stateArrayCopy = [...prev];
    //   const indexOfLoaderID = stateArrayCopy.findIndex(loaderID => loaderID === id);

    //   stateArrayCopy.splice(indexOfLoaderID, 1);
    //   return stateArrayCopy;
    // });
    setLoading(counter => {
      const newCounter = counter - 1;
      return newCounter >= 0 ? newCounter : 0;
    });
  };

  return [addLoader, removeLoader];
};
