import React, { useState } from 'react'
import Layout from '../core/Layout'
import axios from 'axios' // make request to back-end when user signs up
import { ToastContainer, toast } from 'react-toastify' // adds notifications
import 'react-toastify/dist/ReactToastify.min.css'

const Forgot = ({ history }) => { // we have history  from BrowserRouter wrapper
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Request password reset'
    })

    const { email, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()  // so that page will not reload
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
            .then(response => {
                console.log('FORGOT PASSWORD SUCCESS ', response)
                toast.success(response.data.message)
                setValues({ ...values, buttonText: 'Requested' })

            })
            .catch(error => {
                console.log('FORGOT PASSWORD error', error.response.data)
                toast.error(error.response.data.error)
                setValues({ ...values, buttonText: 'Request password reset' })
            })
    }



    // if we use {}, then we need a return
    const passwordForgotForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            {/* {JSON.stringify(isAuth())} */}
            <div className="col-d-6 offset-md-3">
                <ToastContainer /> {/* for toast messages to work */}
                <h1 className="p-5 text-center">Forgot password</h1>
                {passwordForgotForm()}

            </div>
        </Layout>
    )
}


export default Forgot