
using AutoMapper;
using BillingAPI.DTOs;
using BillingAPI.Entities;

namespace BillingAPI.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile() {
            CreateMap<Product, ProductDto>().ReverseMap();

            CreateMap<Customer, CustomerDto>().ReverseMap();

        }

    }
}
