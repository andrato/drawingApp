import React from 'react';
import { Draw } from './Draw';
import { fireEvent, customRender as render, screen } from '../../../tests/test-utils';
import axiosMock from '../../../tests/axiosMock';
import { HOST } from '@/services/DrawingsInProgress';

const FILENAME = "ceva";

jest.mock('./utils/CanvasRecorder', () => ({
    CanvasRecorder: () => ({
        start: jest.fn(),
        stop: jest.fn(),
        save: () => new File([""], FILENAME, { type: "video/webm"}),
        pause: jest.fn(),
        download: jest.fn(),
        createStream: jest.fn(),
        captureMediaStream: jest.fn(),
    }),
}));

// jest.mock('./useOnDraw', () => {
//     const original = jest.requireActual('./useOnDraw').useOnDraw;
  
//     return {
//         useOnDraw: {...original(), saveImage: jest.fn()}
//     }
//   });

describe("Draw Component", () => {
    beforeEach(() => {
        axiosMock.onGet(HOST + '/check').reply(200, {status: 0});
        window.HTMLCanvasElement.prototype.toBlob = jest.fn();
        window.HTMLCanvasElement.prototype.getContext = jest.fn();
    });
    afterEach(() => {
        axiosMock.reset();
    })
    describe("When user is logged in", () => {
        it("Should should the modal with the filename", async () => {
            render(<Draw />);

            expect(await screen.findByText("New drawing")).toBeInTheDocument();
        });

        describe("When no drawing name is typed", () => {
            it('Should throw error on submit', async () => {
                render(<Draw />);

                await screen.findByText("New drawing");

                fireEvent.change(
                    screen.getByPlaceholderText('Select a name'),
                    {target: {value: ""}},
                )

                fireEvent.click(screen.getByText('Create Drawing'));

                expect(await screen.findByText('Name cannot be empty')).toBeInTheDocument();
            });
        });
        describe("When drawing name contains spaces", () => {
            it('Should throw error on "Create drawing"', async () => {
                render(<Draw />);

                await screen.findByText("New drawing");

                fireEvent.change(
                    screen.getByPlaceholderText('Select a name'),
                    {target: {value: "Some name"}},
                )

                fireEvent.click(screen.getByText('Create Drawing'));

                expect(await screen.findByText('Name cannot contain white spaces')).toBeInTheDocument();
            });
        });
        describe("When filename already exists", () => {
            beforeEach(() => {
                axiosMock.onGet(HOST + '/check').reply(200, {
                    status: 1, 
                    error: "Please use another name!",
                })
            })
            
            it("Should display error", async () => {
                render(<Draw />);

                await screen.findByText("New drawing");

                fireEvent.change(
                    screen.getByPlaceholderText('Select a name'),
                    {target: {value: "something"}},
                )

                fireEvent.click(screen.getByText('Create Drawing'));

                expect(await screen.findByText('Please use another name!')).toBeInTheDocument();

            });
        });

        describe("When filename is set successfully", () => {
            it('Should show drawing page', async () => {
                const {findByText, getByText} = render(<Draw />);

                await screen.findByText("New drawing");

                fireEvent.change(
                    screen.getByPlaceholderText('Select a name'),
                    {target: {value: "something"}},
                )

                fireEvent.click(screen.getByText('Create Drawing'));

                expect(await findByText('Save')).toBeInTheDocument();
                expect(getByText('Publish')).toBeInTheDocument();
                expect(getByText('Clear All')).toBeInTheDocument();
            });
        });
    });
})