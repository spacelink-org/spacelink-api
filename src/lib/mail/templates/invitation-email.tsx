import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Section,
    Text,
    Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface InvitationEmailProps {
    username?: string
    invitedByUsername?: string
    inviteLink?: string
}

export const InvitationEmail = ({
    username,
    invitedByUsername,
    inviteLink,
}: InvitationEmailProps) => {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className='bg-white my-auto mx-auto font-sans px-2'>
                    <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]'>
                        <Section className='mt-[32px]'>
                            <Img
                                src={`/static/spacelink-logo.ico`}
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
                            Você foi convidado para participar do sistema
                            Members Club da Spacelink por {invitedByUsername}.
                            Para começar a usar o nosso sistema basta acessar o
                            link abaixo e confirmar seu email.
                        </Text>
                        <Section className='text-center mt-[32px] mb-[32px]'>
                            <Button
                                className='bg-[#000000] rounded-[12px] text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                                href={inviteLink}
                            >
                                Acessar sistema
                            </Button>
                        </Section>
                        <Text className='text-black text-[14px] leading-[24px]'>
                            Caso você não seja o {username} convidado, por favor
                            ignore este email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
