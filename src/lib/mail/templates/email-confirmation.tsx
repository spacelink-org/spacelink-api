import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Section,
    Text,
    Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface VercelInviteUserEmailProps {
    username?: string
    confirmLink?: string
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : ''

export const ConfirmEmailTemplate = ({
    username,
    confirmLink,
}: VercelInviteUserEmailProps) => {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className='bg-white my-auto mx-auto font-sans px-2'>
                    <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]'>
                        <Section className='mt-[32px]'>
                            <Img
                                src={`${baseUrl}/static/spacelink-logo.ico`}
                                width='40'
                                height='40'
                                alt='Spacelink'
                                className='my-0 mx-auto'
                            />
                        </Section>
                        <Heading className='text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0'>
                            <strong>Members Club</strong>
                        </Heading>
                        <Text className='text-black text-[14px] leading-[24px]'>
                            Olá {username},
                        </Text>
                        <Text className='text-black text-[14px] leading-[24px]'>
                            Bem vindo ao <strong>Members Club</strong> da{' '}
                            <strong>Spacelink</strong>, estamos felizes em te
                            receber aqui!
                        </Text>
                        <Text className='text-black text-[14px] leading-[24px]'>
                            Para começar a usar o nosso sistema, você precisa
                            confirmar seu email. Clique no botão abaixo para
                            confirmar seu email.
                        </Text>
                        <Section className='text-center mt-[32px] mb-[32px]'>
                            <Button
                                className='bg-[#000000] rounded-[12px] text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                                href={confirmLink}
                            >
                                Confirmar email
                            </Button>
                        </Section>
                        <Text className='text-black text-[14px] leading-[24px]'>
                            ou copie e cole este link no seu navegador:{' '}
                            <Link
                                href={confirmLink}
                                className='text-blue-600 no-underline'
                            >
                                {confirmLink}
                            </Link>
                        </Text>
                        <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ConfirmEmailTemplate
