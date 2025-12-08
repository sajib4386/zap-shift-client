import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router'
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    // prevent multiple API calls
    const apiCalled = useRef(false);

    useEffect(() => {
        if (!sessionId) return;

        // যদি আগে API কল করা হয়ে থাকে, তাহলে আর কল করবে না
        if (apiCalled.current) return;

        apiCalled.current = true;

        axiosSecure
            .patch(`/payment-success?session_id=${sessionId}`)
            .then((res) => {
                console.log(res.data);
                setPaymentInfo({
                    transactionId: res.data.transactionId,
                    trackingId: res.data.trackingId,
                });
            });
    }, [sessionId]);

    return (
        <div>
            <h2 className="text-5xl">Payment Successful</h2>
            <p>Your Transaction ID: {paymentInfo.transactionId}</p>
            <p>Your Parcel Tracking ID: {paymentInfo.trackingId}</p>
        </div>
    );
};

export default PaymentSuccess;
