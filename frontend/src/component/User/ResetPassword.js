import {React ,  useState, useEffect} from 'react'
import "./resetPassword.css"
import Loader from '../layout/Loader/Loader'
import { Fragment } from 'react'
import MetaData from '../layout/MetaData'
import {useDispatch , useSelector} from "react-redux"
import {clearErrors ,resetPassword} from "../../actions/userAction"

import { useAlert } from 'react-alert'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@mui/icons-material/Lock';

const ResetPassword = ({history,match}) => {
    const alert = useAlert();

    const dispatch = useDispatch();

    const {error , success , loading} = useSelector((state)=>state.forgotPassword);

    const [password, setPassword] = useState("")

    const [confirmPassword, setConfirmPassword] = useState("")


    const resetPasswordSubmit = (e)=>{
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("password",password);    
        myForm.set("confirmPassword",confirmPassword);
        dispatch(resetPassword(match.params.token,myForm))
    }

    useEffect(()=>{

        if(error){
            alert.error(error);
            dispatch(clearErrors());   
        }
        if(success){
           alert.success("Password Updated Suuceesfully")
           
           history.push("/login")

          
        }
    },[dispatch,error,alert,history,success,])



  return (
    <Fragment>
    {loading ? <Loader /> : 
    (
        <Fragment>
<MetaData title="Change password" />
    <div className='resetPasswordContainer'>
        <div className='resetPasswordBox'>
        <h2 className='resetPasswordHeading'>Update Profile</h2>

        <form
            className='resetPasswordForm'
            onSubmit={resetPasswordSubmit}
            >

                

                    
                <div >

                    <LockOpenIcon />
                        <input 
                            type="password"
                            placeholder='New Password'
                            required
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                />
                </div>
                <div >

                    <LockIcon />
                        <input 
                            type="password"
                            placeholder='Confirm Password'
                            required
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                </div>
                <input type="submit" value="Update" className="resetPasswordBtn" />
            </form>

        </div>  

    </div>
</Fragment>
    )}
</Fragment>
  )
    }

export default ResetPassword