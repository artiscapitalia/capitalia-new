import React from 'react'
import Link from 'next/link'
import { EditableText } from '@/components/admin/edit-mode'
import { OurAdvantagesProps } from './types'

// SVG icons for each advantage
const AccessibleIcon = () => (
  <svg 
    version="1.1" 
    id="Layer_1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
    x="0px" 
    y="0px" 
    width="433px" 
    height="500px" 
    viewBox="0 0 433 500" 
    enableBackground="new 0 0 433 500" 
    xmlSpace="preserve"
  >
    <path d="M216.5,0L0,125v250l216.5,125L433,375V125L216.5,0z M392.639,351.692L216.5,453.388L40.361,351.692V148.306L216.5,46.611 l176.139,101.694V351.692z" />
    <path d="M176.495,177.291c0.981,0,1.982-0.18,2.978-0.537l40.165-14.861c5.902-2.185,9.339-10.289,7.702-18.121 c-1.646-7.834-7.756-12.409-13.646-10.228l-40.179,14.87c-5.888,2.178-9.34,10.279-7.703,18.115 C167.188,173.034,171.642,177.291,176.495,177.291 M176.495,217.793c0.981,0,1.982-0.179,2.978-0.548l79.422-29.371 c5.9-2.192,9.347-10.306,7.703-18.128c-1.638-7.827-7.756-12.41-13.652-10.227l-79.429,29.39 c-5.887,2.172-9.339,10.286-7.703,18.123C167.181,213.524,171.642,217.793,176.495,217.793 M252.945,200.021l-79.429,29.371 c-5.887,2.183-9.339,10.303-7.688,18.122c1.354,6.512,5.815,10.771,10.668,10.771c0.981,0,1.982-0.18,2.978-0.548l79.422-29.38 c5.901-2.185,9.341-10.294,7.702-18.112C264.953,202.411,258.842,197.837,252.945,200.021 M252.945,240.919l-79.429,29.375 c-5.887,2.177-9.339,10.3-7.688,18.115c1.354,6.515,5.815,10.763,10.668,10.763c0.128,0,0.257-0.019,0.38-0.019 c0.038,0,0.06,0.01,0.093,0.01c0.487,0.065,5.164,1.134,9.111,4.401c1.896,1.54,3.567,3.498,4.866,5.923v35.955h50.527v-35.971 c2.1-3.981,5.422-6.695,8.515-8.305c1.582-0.845,3.053-1.359,4.074-1.661c0.509-0.154,0.908-0.244,1.15-0.297 c0.108-0.023,0.19-0.037,0.23-0.046c2.748-0.403,5.077-2.944,5.93-6.444c0.839-3.501,0.054-7.347-1.991-9.809l-8.832-10.574 l8.347-3.089c5.901-2.176,9.341-10.288,7.702-18.112C264.953,243.308,258.842,238.736,252.945,240.919 M239.631,287.069 c-3.573,2.771-7.337,6.804-10.232,12.641c-1.149,2.309-2.141,4.927-2.912,7.773h-20.562c-0.771-2.847-1.746-5.465-2.904-7.773 c-1.55-3.114-3.337-5.695-5.197-7.862l36.637-13.555l6.511,7.796C240.524,286.398,240.077,286.721,239.631,287.069 M201.924,368.513 h28.571v-11.32h-28.571V368.513z" />
  </svg>
)

const PersonalIcon = () => (
  <svg 
    version="1.1" 
    id="Layer_1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
    x="0px" 
    y="0px" 
    width="433px" 
    height="500px" 
    viewBox="0 0 433 500" 
    enableBackground="new 0 0 433 500" 
    xmlSpace="preserve"
  >
    <path d="M216.5,0L0,125v250l216.5,125L433,375V125L216.5,0z M392.639,351.692L216.5,453.388L40.361,351.692V148.306L216.5,46.611 l176.139,101.694V351.692z" />
    <path d="M280.498,171.055c-2.613-2.503-6.654-3.754-12.114-3.754h-25.083v-11.431c0-5.46-1.248-9.499-3.753-12.115 c-2.614-2.502-6.655-3.754-12.114-3.754H204.57c-5.46,0-9.499,1.251-12.115,3.754c-2.503,2.617-3.754,6.655-3.754,12.115V167.3 h-25.082c-5.46,0-9.499,1.251-12.115,3.754c-2.503,2.617-3.754,6.655-3.754,12.115v159.368c0,5.459,1.251,9.5,3.754,12.114 c2.616,2.503,6.655,3.752,12.115,3.752h104.767c5.46,0,9.501-1.249,12.114-3.754c2.504-2.614,3.755-6.655,3.755-12.115V183.17 C284.252,177.71,283.004,173.671,280.498,171.055 M175.05,290.152h81.901v40.951H175.05V290.152" />
  </svg>
)

const TrustworthyIcon = () => (
  <svg 
    version="1.1" 
    id="Layer_1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
    x="0px" 
    y="0px" 
    width="433px" 
    height="500px" 
    viewBox="0 0 433 500" 
    enableBackground="new 0 0 433 500" 
    xmlSpace="preserve"
  >
    <path d="M216.5,0L0,125v250l216.5,125L433,375V125L216.5,0z M392.639,351.692L216.5,453.388L40.361,351.692V148.306L216.5,46.611 l176.139,101.694V351.692z" />
    <path d="M286.775,195.22c-14.947,0-28.502,6.083-38.32,15.899l-68.49,67.063c-7.364,7.366-17.531,11.927-28.743,11.927 c-22.424,0-40.667-18.244-40.667-40.668c0-22.422,18.244-40.664,40.667-40.664c11.212,0,21.379,4.56,28.743,11.924l6.963,6.817 c-1.159,2.555-1.817,5.382-1.817,8.369c0,5.617,2.276,10.699,5.954,14.381l28.761-28.761c-3.68-3.676-8.765-5.953-14.382-5.953 c-3.289,0-6.388,0.798-9.138,2.184l-6.761-6.619c-9.818-9.817-23.373-15.899-38.323-15.899C121.324,195.22,97,219.545,97,249.441 c0,29.899,24.324,54.225,54.222,54.225c14.947,0,28.504-6.083,38.325-15.901l68.489-67.066c7.364-7.364,17.53-11.924,28.739-11.924 c22.427,0,40.668,18.242,40.668,40.667c0,22.427-18.241,40.668-40.668,40.668c-7.977,0-15.395-2.34-21.678-6.322 c0.858-2.252,1.346-4.683,1.346-7.234c0-5.617-2.276-10.699-5.954-14.381l-5.203,5.207l-13.558-13.558l-4.792,4.794l13.557,13.556 l-8.765,8.765l-13.557-13.557l-4.793,4.792l13.558,13.557l-5.208,5.205c3.684,3.679,8.766,5.952,14.382,5.952 c3.681,0,7.123-0.992,10.098-2.699c8.713,5.97,19.236,9.48,30.567,9.48c29.9,0,54.225-24.326,54.225-54.225 C341,219.545,316.676,195.22,286.775,195.22z" />
  </svg>
)

export const OurAdvantages: React.FC<OurAdvantagesProps> = ({ lang = 'lv' }) => {
  const advantages = [
    {
      id: 'accessible',
      icon: AccessibleIcon,
      defaultTitle: 'Pieejams',
      defaultDescription: 'Mūsdienīgs un vienkāršs finansējums, bez liekas birokrātijas'
    },
    {
      id: 'personal',
      icon: PersonalIcon,
      defaultTitle: 'Personīgs',
      defaultDescription: 'Katram klientam ir nozīmēts personīgs finanšu konsultants ikdienas atbalstam'
    },
    {
      id: 'trustworthy',
      icon: TrustworthyIcon,
      defaultTitle: 'Uzticams',
      defaultDescription: '15 gadu pieredze finansējot vairāk kā 5000 uzņēmumus Latvijā, Lietuvā, Igaunijā un Somijā'
    }
  ]

  return (
    <div className="mx-auto px-4 max-w-screen-xl mb-24" style={{ marginBottom: '90px' }}>
      <div className="w-full">
        <h2 className="text-black mb-2.5 text-[40px] font-semibold normal-case text-center">
          <EditableText 
            componentId="our-advantages"
            elementId="title"
            defaultContent="Mūsu priekšrocības"
            tag="span"
          />
        </h2>
        <div 
          className="text-gray-600 py-0 px-20 text-xl text-center"
        >
          <EditableText 
            componentId="our-advantages"
            elementId="subtitle"
            defaultContent="Eiropas Savienībā licensēta finansējuma iestāde"
            tag="span"
          />
        </div>

        <div className="w-[95px] h-[3px] bg-[#0172E3] my-5 mx-auto mb-[30px]"></div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {advantages.map((advantage) => {
            const IconComponent = advantage.icon
            return (
              <div key={advantage.id} className="px-9">
                <div className="text-center py-5">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-[#0172E3]">
                      <IconComponent />
                    </div>

                    <h3 className="text-2xl font-semibold text-[#333] m-0 ml-4">
                      <EditableText 
                        componentId="our-advantages"
                        elementId={`advantage-${advantage.id}-title`}
                        defaultContent={advantage.defaultTitle}
                        tag="span"
                      />
                    </h3>
                  </div>

                  <span className="text-[20px] text-[#5f5f5f] leading-[28px] block mt-2.5">
                    <EditableText 
                      componentId="our-advantages"
                      elementId={`advantage-${advantage.id}-description`}
                      defaultContent={advantage.defaultDescription}
                      tag="span"
                    />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center pt-10">
          <Link
            href={`/${lang}/apply-loan`}
            className="inline-block px-[18px] py-3 text-lg font-semibold text-white bg-[#1375e0] border border-[#1375e0] rounded no-underline outline-none"
          >
            <EditableText 
              componentId="our-advantages"
              elementId="button-text"
              defaultContent="Kļūt par klientu"
              tag="span"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
