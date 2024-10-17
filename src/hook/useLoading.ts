
import { useAppDispatch } from "@/redux";
import { changeLoading } from "@/redux/reducers";




const useLoading =() =>{
    const dispatch = useAppDispatch();
    const changeLoadingStatus = (isLoading:Boolean) =>{
        dispatch(changeLoading(isLoading))
    };

    const showLoading = () =>{
        changeLoadingStatus(true);
    }
    const hideLoading = () =>{
        changeLoadingStatus(false);
    }
    return { showLoading, hideLoading };

}
export default useLoading