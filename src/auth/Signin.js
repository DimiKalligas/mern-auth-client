import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios' // make request to back-end when user signs up
import { authenticate, isAuth } from './helpers'
import { ToastContainer, toast } from 'react-toastify' // adds notifications
import Google from './Google'
import 'react-toastify/dist/ReactToastify.min.css'

const Signin = ({ history }) => { // we have history  from BrowserRouter wrapper
    const [values, setValues] = useState({
        email: 'net.logix@yahoo.gr',
        password: 'abababa',
        buttonText: 'Submit'
    })

    const { email, password, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const informParent = response => {
        authenticate(response, () => { // will save info in localStorage and Cookie
            isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
        })
    }

    const clickSubmit = event => {
        event.preventDefault()  // so that page will not reload
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email, password }
        })
            .then(response => {
                console.log('Signin success ', response)
                // save the response (user, token) user info in local storage / token in cookie
                authenticate(response, () => {
                    setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' })
                    // toast.success(`Hey ${response.data.user.name}, welcome back!`)
                    isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
                })
            })
            .catch(error => {
                console.log('signin error', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }



    // if we use {}, then we need a return
    const signinForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
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
                {isAuth() ? <Redirect to="/" /> : null}
                {/* {JSON.stringify({ name, email, password })} */}
                <h1 className="p-5 text-center">Signin</h1>
                <Google informParent={informParent} />
                {signinForm()}
                <br />
                <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot Password</Link>
            </div>
        </Layout>
    )
}


export default Signin