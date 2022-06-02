import React from 'react'
import './croxmas.css'

const CroxMas: React.FC = () => {

    return (
        <>
            <div className="window" id="window_icon">
                <div className="santa">
                    <div className="santa_head">
                        <div className="face">
                            <div className="redhat">
                                <div className="whitepart" />
                                <div className="redpart" />
                                <div className="hatball" />
                            </div>
                            <div className="eyes" />
                            <div className="beard">
                                <div className="nouse" />
                                <div className="mouth" />
                            </div>
                        </div>
                        <div className="ears" />
                    </div>
                    <div className="body" />
                </div>
            </div>
        </>
    )
}

export default CroxMas;
