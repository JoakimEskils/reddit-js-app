import { Box, Button, Container, Flex, Input, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "Reddit",
  description: "A reddit clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" position="sticky" top="0" zIndex="sticky">
            <Container maxW="container.xl">
              <Flex justify="space-between" align="center" h="48px">
                <Flex align="center" gap="4">
                  <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.900">Reddit</Text>
                  </Link>
                  <Flex display={{ base: "none", md: "flex" }} gap="4">
                    <Link href="/r/popular" style={{ color: '#1A1A1B', textDecoration: 'none', fontWeight: 500 }}>
                      Popular
                    </Link>
                    <Link href="/r/all" style={{ color: '#1A1A1B', textDecoration: 'none', fontWeight: 500 }}>
                      All
                    </Link>
                  </Flex>
                </Flex>
                <Flex align="center" gap="4">
                  <Input
                    display={{ base: "none", md: "block" }}
                    placeholder="Search Reddit"
                    size="sm"
                    width="auto"
                    minW="300px"
                    bg="gray.50"
                    _hover={{ bg: "white" }}
                    _focus={{ bg: "white", borderColor: "blue.500" }}
                  />
                  <Button colorScheme="blue" size="sm">Sign In</Button>
                </Flex>
              </Flex>
            </Container>
          </Box>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
