import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios' // make request to back-end when user signs up
import { isAuth } from './helpers'
import { ToastContainer, toast } from 'react-toastify' // adds notifications
import 'react-toastify/dist/ReactToastify.min.css'

const Signup = () => {
    const [values, setValues] = useState({
        name: 'DaMits',
        email: 'net.logix@yahoo.gr',
        password: 'abababa',
        buttonText: 'Submit'
    })

    const { name, email, password, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()  // so that page will not reload
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signup`,
            data: { name, email, password }
        })
            .then(response => {
                console.log('Signup success ', response)
                setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' })
                toast.success(response.data.message)
            })
            .catch(error => {
                console.log('signup error', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }



    // if we use {}, then we need a return
    const signupForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                {/* value makes for controlled component */}
                <input onChange={handleChange('name')} value={name} type="text" size="20" className="form-control" />
            </div>

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
            <div className="col-d-6 offset-md-3">
                <ToastContainer /> {/* for toast messages to work */}
                {isAuth() ? <Redirect to="/" /> : null}
                {/* {JSON.stringify({ name, email, password })} */}
                <h1 className="p-5 text-center">Signup</h1>
                {signupForm()}
                <br />
                <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot Password</Link>
            </div>
        </Layout>
    )
}


export default Signup