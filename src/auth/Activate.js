import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios' // make request to back-end when user signs up
import jwt from 'jsonwebtoken'
import { ToastContainer, toast } from 'react-toastify' // adds notifications
import 'react-toastify/dist/ReactToastify.min.css'

// props.match is from BrowserRouter
const Activate = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        show: true
    })

    useEffect(() => {
        // console.log('useEffect Hello!!!')
        let token = match.params.token
        let { name } = jwt.decode(token)
        // console.log(token)
        if (token) {
            setValues({ ...values, name, token })
        }
    }, [])

    const { name, token, show } = values

    const clickSubmit = event => {
        event.preventDefault()  // so that page will not reload
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: { token }
        })
            .then(response => {
                console.log('Activation success ', response)
                setValues({ ...values, show: false })
                toast.success(response.data.message)
            })
            .catch(error => {
                console.log('Activation error', error.response.data.error)
                toast.error(error.response.data.error)
            })
    }

    // with parenthesis we don;t have to use return
    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5">Hey {name}, ready to activate your account?</h1>
            <button className="btn btn-outline-primary" onClick={clickSubmit}>Activate account</button>
        </div>
    )

    return (
        <Layout>
            <div className="col-d-6 offset-md-3">
                <ToastContainer /> {/* for toast messages to work */}
                {/* {JSON.stringify({ name, email, password })} */}
                {activationLink()}

            </div>
        </Layout>
    )
}


export default Activate