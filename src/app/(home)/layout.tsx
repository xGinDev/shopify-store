export const metadata = {
  title: 'Kauter Store',
  description: 'Explora nuestras diversas categorías de ropa para hombres, mujeres y niños. Desde elegantes conjuntos para ocasiones especiales hasta prendas casuales para el día a día',
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            {children}
        </main>
    );
}
