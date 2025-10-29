import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EditableText } from '@/components/admin/edit-mode'
import { IntroProps } from './types'

export const Intro: React.FC<IntroProps> = ({ lang = 'lv' }) => {
    return (
        <div className="mx-auto px-4 max-w-screen-xl">
            <div className="heading-content relative">
                <h1 className="text-gray-800 mb-16 font-serif">
                    <EditableText 
                        componentId="intro"
                        elementId="heading-line1"
                        defaultContent="Pieejams finansējums"
                        className="block"
                        tag="span"
                    />
                    <EditableText 
                        componentId="intro"
                        elementId="heading-line2"
                        defaultContent="mazam un vidējam uzņēmumam"
                        className="block mt-2 text-capitalia-blue"
                        tag="span"
                    />
                </h1>

                <div className="intro text-gray-600">
                    <EditableText 
                        componentId="intro"
                        elementId="description"
                        defaultContent="Capitalia finansējums uzņēmumiem kalpo kā vienkāršs papildinājums vai alternatīva banku sniegtajiem aizdevumiem"
                        tag="div"
                    />
                </div>

                {/* Absolutely positioned right image */}
                <div className="absolute-image-block">
                    <div
                        className="relative w-38 h-45 rounded-xl overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity duration-300"
                        style={{
                            backgroundImage: 'url("/images/consultation_card_2.png")'
                        }}
                    >
                        <Image
                            src="/images/member-photo-overlay-2.png"
                            width={152}
                            height={180}
                            className="w-full h-full object-cover"
                            alt="Consultation"
                        />
                    </div>
                </div>

                <Link
                    href={`/${lang}/apply-loan`}
                    className="apply-btn apply-btn-blue apply-btn-large"
                >
                    <EditableText 
                        componentId="intro"
                        elementId="button-text"
                        defaultContent="Vēlos veicināt biznesa izaugsmi"
                        tag="span"
                    />
                </Link>
            </div>
        </div>
    )
}
