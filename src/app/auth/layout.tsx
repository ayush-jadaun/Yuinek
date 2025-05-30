
import type { ReactNode, FC } from 'react';

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <html lang="en">
        <body
         className="min-h-screen flex flex-col"
         >
            {children}
        </body>
    </html>
);

export default RootLayout;
