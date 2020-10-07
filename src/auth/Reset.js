import React, { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import Layout from '../core/Layout'
import axios from 'axios' // make request to back-end when user signs up
import { ToastContainer, toast } from 'react-toastify' // adds notifications
import 'react-toastify/dist/ReactToastify.min.css'

const Reset = ({ match }) => {
    const [values, setValues] = useState({ // match from react-router-dom
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset password'
    })

    useEffect(() => {
        let token = match.params.token  // see https://www.freecodecamp.org/news/hitchhikers-guide-to-react-router-v4-4b12e369d10/
        let { name } = jwt.decode(token)
        if (token) {
            setValues({ ...values, name, token })
        }
    }, [])

    const { name, token, newPassword, buttonText } = values

    const handleChange = event => {
        // console.log(event.target.value)
        setValues({ ...values, newPassword: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()  // so that page will not reload
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
            .then(response => {
                console.log('RESET PASSWORD SUCCESS ', response)
                toast.success(response.data.message)
                setValues({ ...values, buttonText: 'Done' })

            })
            .catch(error => {
                console.log('RESET PASSWORD error', error.response.data)
                toast.error(error.response.data.error)
                setValues({ ...values, buttonText: 'Reset password' })
            })
    }


    // if we use {}, then we need a return
    const resetPasswordForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange}
                    value={newPassword}
                    type="password"
                    className="form-control"
                    placeholder="type new password"
                    required
                />
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
                <h1 className="p-5 text-center">Hey {name}, please type new password</h1>
                {resetPasswordForm()}

            </div>
        </Layout>
    )
}


export default Reset