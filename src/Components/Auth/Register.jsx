import React from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Hooks/useAuth'
import { Link } from 'react-router'
import SocialLogin from './SocialLogin'

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const { creatUser } = useAuth()

    const handleRegisterSubmit = (data) => {
        console.log(data)

        creatUser(data.email, data.password)
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
                <h1 className='text-4xl font-bold'>Create an Account</h1>
                <p className='text-gray-500'>Register with ZapShift</p>
            </div>
            <div>
                <form onSubmit={handleSubmit(handleRegisterSubmit)}>
                    <fieldset className="fieldset">
                        {/* Name */}
                        <label className="label">Name</label>
                        <input type="text" className="input" placeholder="Your Name" {...register("name", { required: true })} />
                        {errors.name?.type === "required" && (
                            <p className='text-red-500'>name is required</p>
                        )}

                        {/* Email */}
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email" {...register("email", { required: true })} />
                        {errors.email?.type === "required" && (
                            <p className='text-red-500'>email is required</p>
                        )}

                        {/* Password */}
                        <label className="label">Password</label>
                        <input type="password" className="input" placeholder="Password"
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
                            })} />
                        {errors.password?.type === "required" && (
                            <p className='text-red-500'>password is required</p>
                        )}

                        {errors.password?.type === "minLength" && (
                            <p className='text-red-500'>password must be 6 characters or longer</p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p className='text-red-500'>Password must be at least 6 characters, include uppercase, lowercase, number, and special character.</p>
                        )}

                        <button className="btn bg-primary mt-4">register</button>
                    </fieldset>
                    <p>Already have an account? <Link to="/login" className='text-xl font-bold text-secondary underline'>Login</Link></p>

                    <SocialLogin></SocialLogin>

                </form>
            </div>
        </div>
    )
}

export default Register