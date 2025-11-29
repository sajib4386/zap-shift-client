import React from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Hooks/useAuth'
import { Link } from 'react-router'
import SocialLogin from './SocialLogin'

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const { signInUser } = useAuth()

    const handleLoginSubmit = (data) => {
        console.log(data)

        signInUser(data.email, data.password)
            .then(result => {
                console.log(result.user)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div>
            <div className='mb-5'>
                <h1 className='text-4xl font-bold'>Welcome Back</h1>
                <p className='text-gray-500'>Login with ZapShift</p>
            </div>
            <div>
                <form onSubmit={handleSubmit(handleLoginSubmit)}>
                    <fieldset className="fieldset">

                        {/* Email */}
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email" {...register("email", { required: true })} />
                        {errors.email?.type === "required" && (
                            <p className='text-red-500'>email is required</p>
                        )}

                        {/* Password */}
                        <label className="label">Password</label>
                        <input type="password" className="input" placeholder="Password" {...register("password", { required: true, })} />
                        {errors.password?.type === "required" && (
                            <p className='text-red-500'>password is required</p>
                        )}

                        <div><a className="link link-hover">Forgot password?</a></div>

                        <button className="btn bg-primary mt-4">Login</button>
                    </fieldset>
                    <p>Already have an account? <Link to="/register" className='text-xl font-bold text-secondary underline'>Register</Link></p>

                    <SocialLogin></SocialLogin>

                </form>
            </div>
        </div>
    )
}

export default Login