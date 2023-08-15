import { HOST_CATEGORY_DRAWINGS } from '@/services/Drawings';
import axiosMock from '../../../tests/axiosMock';
import { fireEvent, customRender as render, screen } from '../../../tests/test-utils';
import { Home } from './Home';
import { categories } from '../common/constants';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

jest.mock('next/navigation', () => ({
    ...require('next-router-mock'),
    useSearchParams: jest.fn().mockReturnValue({
        get: jest.fn(),
        set: jest.fn(),
        getAll: jest.fn(),
    })
}));

const drawingMock = {
    id: "some_id",
    userId: "an_user_id",
    userInfo: {
        name: "Dan",
        imgPath: "http://something/",
    },
    created: Date.now(),
    lastUpdated: Date.now(),
    title: "fdsfdfs",
    displayTitle: "Art drawing",
    labels: ["nature", "everything"],
    reviews: 3,
    rating: 3,
    video: {
        location: "http:...",
        filename: "video",
        size: 321321,
    },
    image: {
        location: "http:...",
        filename: "img",
        size: 321321,
    },
    category: "Top Art",
};

const drawingsTopArtMock = {
    drawings: [drawingMock]
}

const drawingsTopAmateurMock = {
    drawings: [{...drawingMock, displayTitle: "Amateur drawing", category: "Top Amateur",}]
}

const drawingsGalleryMock = {
    drawings: [{...drawingMock, displayTitle: "Gallery drawing", category: "Gallery",}]
}

describe("#Home", () => {
    beforeEach(() => {
        axiosMock.onGet(HOST_CATEGORY_DRAWINGS).reply((config) => {
            if (config.params.category === 'topArt') {
                return [200, drawingsTopArtMock];
            } else if (config.params.category === 'topAmateur') {
                return [200, drawingsTopAmateurMock];
            } else {
                return [200, drawingsGalleryMock];
            }
        });
    });
    afterEach(() => {
        axiosMock.reset();
    });

    describe("When all data is available", () => {
        it("Should display categories", async () => {
            const {findByText} = render(
                <Home />
            );

            categories.map(async (category) => expect(await findByText(category)).toBeInTheDocument());
        });

        it("Should display drawings", async () => {
            const {findByText, findByAltText, getByAltText} = render(
                <Home />
            );

            await findByText("Gallery");

            expect(await findByAltText("Amateur drawing")).toBeInTheDocument();
            expect(getByAltText("Art drawing")).toBeInTheDocument();
            expect(getByAltText("Gallery drawing")).toBeInTheDocument();
        });
    });

    describe("When clicking on a drawing", () => {
        it("Should navigate to the drawing's page", async () => {
            mockRouter.push("/");

            const {findByText, findByAltText, getByAltText} = render(
                <Home />
            );

            await findByText("Top Art");
            const drawing = await findByAltText("Art drawing")

            fireEvent.click(drawing);

            console.log(JSON.stringify(mockRouter));

            expect(mockRouter.pathname).toEqual(`/gallery/${drawingMock.id}`);
        });
    });
});