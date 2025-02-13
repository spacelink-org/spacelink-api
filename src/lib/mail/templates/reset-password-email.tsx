import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordEmailProps {
    username?: string
    link?: string
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : ''

export const ResetPasswordEmail = ({
    username,
    link,
}: ResetPasswordEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Recupere sua senha!</Preview>
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
                            Para recuperar sua conta crie uma nova senha
                            clicando no link abaixo
                        </Text>
                        <Section className='text-center mt-[32px] mb-[32px]'>
                            <Button
                                className='bg-[#000000] rounded-[12px] text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                                href={link}
                            >
                                Criar nova senha
                            </Button>
                        </Section>
                        <Text className='text-black text-[14px] leading-[24px]'>
                            ou copie e cole este link no seu navegador:{' '}
                            <Link
                                href={link}
                                className='text-blue-600 no-underline'
                            >
                                {link}
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ResetPasswordEmail
