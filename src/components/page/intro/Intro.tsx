import React from 'react'
import Image from 'next/image'
import { EditableText } from '@/components/admin/edit-mode'
import { Button } from '@/components/page/elements'
import { IntroProps } from './types'

export const Intro: React.FC<IntroProps> = ({ lang = 'lv', componentId = 'intro' }) => {
    return (
        <div className="mx-auto px-4 max-w-screen-xl">
            <div className="relative">
                <h1 className="text-gray-800 mb-16 font-serif after:content-[''] after:block after:w-[95px] after:h-[3px] after:bg-[#0172E3] after:relative after:top-10">
                    <EditableText 
                        componentId={componentId}
                        elementId="heading-line1"
                        defaultContent="Pieejams finansējums"
                        className="block"
                        tag="span"
                    />
                    <EditableText 
                        componentId={componentId}
                        elementId="heading-line2"
                        defaultContent="mazam un vidējam uzņēmumam"
                        className="block mt-2 text-capitalia-blue"
                        tag="span"
                    />
                </h1>

                <div className="mb-[30px] mr-[250px] font-serif text-2xl font-light text-gray-600">
                    <EditableText 
                        componentId={componentId}
                        elementId="description"
                        defaultContent="Capitalia finansējums uzņēmumiem kalpo kā vienkāršs papildinājums vai alternatīva banku sniegtajiem aizdevumiem"
                        tag="div"
                    />
                </div>

                {/* Absolutely positioned right image */}
                <div className="absolute top-[120px] right-0 z-10">
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

                <Button
                    href={`/${lang}/apply-loan`}
                    text="Vēlos veicināt biznesa izaugsmi"
                    size="medium"
                    componentId={componentId}
                    elementId="button-text"
                    elementKey="button"
                    withContainer={false}
                />
            </div>
        </div>
    )
}
